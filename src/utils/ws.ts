import { createSignal } from "solid-js";
import type { WSClientMessage, WSServerMessage } from "../ws";
import { store } from "./store";

type MessageHandler = (ev: MessageEvent) => void;
type VoidHandler = () => void;

type WSIncomingType = WSServerMessage["type"];

type WSIncomingData<T extends WSIncomingType> = Extract<
	WSServerMessage,
	{ type: T }
>["data"];

class WebSocketSingleton {
	private static instance: WebSocketSingleton;

	private ws: WebSocket | null = null;

	private reconnectAttempts = 0;
	private reconnectTimer?: number;

	private connectionSignal = createSignal(false);
	public isConnected = this.connectionSignal[0];

	private authorizationSignal = createSignal(false);
	public isAuthorized = this.authorizationSignal[0];

	private openListeners = new Set<VoidHandler>();
	private closeListeners = new Set<VoidHandler>();
	private messageListeners = new Set<MessageHandler>();
	private typedListeners = new Map<WSIncomingType, Set<(data: any) => void>>();

	private constructor() {
		this.connect();

		this.on("auth", (data) => {
			if (Number(data.user_id) === Number(store.user?.user_id)) {
				this.authorizationSignal[1](true);
			}
		});
	}

	static getInstance() {
		if (!WebSocketSingleton.instance) {
			WebSocketSingleton.instance = new WebSocketSingleton();
		}
		return WebSocketSingleton.instance;
	}

	onOpen(cb: VoidHandler) {
		this.openListeners.add(cb);
		return () => this.openListeners.delete(cb);
	}

	onClose(cb: VoidHandler) {
		this.closeListeners.add(cb);
		return () => this.closeListeners.delete(cb);
	}

	onMessage(cb: MessageHandler) {
		this.messageListeners.add(cb);
		return () => this.messageListeners.delete(cb);
	}

	on<T extends WSIncomingType>(type: T, cb: (data: WSIncomingData<T>) => void) {
		if (!this.typedListeners.has(type)) {
			this.typedListeners.set(type, new Set());
		}

		const set = this.typedListeners.get(type)!;
		set.add(cb as any);

		return () => set.delete(cb as any);
	}

	send(data: WSClientMessage) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
		this.ws.send(typeof data === "string" ? data : JSON.stringify(data));
		return true;
	}

	private connect() {
		clearTimeout(this.reconnectTimer);

		this.ws = new WebSocket(import.meta.env.VITE_WS_BASE_URL);

		this.ws.onopen = async () => {
			this.reconnectAttempts = 0;
			this.connectionSignal[1](true);

			for (const fn of this.openListeners) {
				fn();
			}
		};

		this.ws.onmessage = (ev) => {
			const msg = JSON.parse(ev.data) as WSServerMessage;

			// raw listeners
			for (const fn of this.messageListeners) {
				fn(ev);
			}

			// typed listeners
			const listeners = this.typedListeners.get(msg.type);
			if (listeners) {
				for (const fn of listeners) {
					fn(msg.data);
				}
			}
		};

		this.ws.onclose = () => {
			this.connectionSignal[1](false);
			this.authorizationSignal[1](false);
			for (const fn of this.closeListeners) {
				fn();
			}
			this.scheduleReconnect();
		};

		this.ws.onerror = () => {
			this.ws?.close();
		};
	}

	private scheduleReconnect() {
		const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 15000);
		this.reconnectAttempts++;

		this.reconnectTimer = window.setTimeout(() => {
			this.connect();
		}, delay);
	}

	public async authenticate(token: string) {
		this.send({
			type: "auth",
			data: {
				token,
			},
		});
	}
}

export const ws = WebSocketSingleton.getInstance();
