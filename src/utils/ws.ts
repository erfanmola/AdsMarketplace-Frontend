import { createSignal } from "solid-js";
import type { WSClientMessage, WSServerMessage } from "../ws";
import { store } from "./store";

/* ---------------- types ---------------- */

type MessageHandler = (ev: MessageEvent) => void;
type VoidHandler = () => void;

type WSIncomingType = WSServerMessage["type"];

type WSIncomingData<T extends WSIncomingType> = Extract<
	WSServerMessage,
	{ type: T }
>["data"];

type Unsubscribe = () => void;

/* ------------- small helpers ------------ */

function addListener<T extends Function>(set: Set<T>, cb: T): Unsubscribe {
	set.add(cb);
	return () => set.delete(cb);
}

function emit<T extends Function>(set: Set<T>, ...args: any[]) {
	for (const fn of [...set]) fn(...args);
}

/* ------------- singleton class ----------- */

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

	private pingInterval?: number;
	private pongTimeout?: number;

	private readonly PING_EVERY = 15_000;
	private readonly PONG_TIMEOUT = 8_000;

	private constructor() {
		this.connect();

		// auto-mark authorized
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

	/* -------- public event API -------- */

	onOpen(cb: VoidHandler) {
		return addListener(this.openListeners, cb);
	}

	onClose(cb: VoidHandler) {
		return addListener(this.closeListeners, cb);
	}

	onMessage(cb: MessageHandler) {
		return addListener(this.messageListeners, cb);
	}

	on<T extends WSIncomingType>(type: T, cb: (data: WSIncomingData<T>) => void) {
		if (!this.typedListeners.has(type)) {
			this.typedListeners.set(type, new Set());
		}
		const set = this.typedListeners.get(type)!;
		return addListener(set, cb as any);
	}

	once<T extends WSIncomingType>(
		type: T,
		cb: (data: WSIncomingData<T>) => void,
	) {
		const off = this.on(type, (data) => {
			off();
			cb(data);
		});
		return off;
	}

	off<T extends WSIncomingType>(
		type: T,
		cb: (data: WSIncomingData<T>) => void,
	) {
		this.typedListeners.get(type)?.delete(cb as any);
	}

	offOpen(cb: VoidHandler) {
		this.openListeners.delete(cb);
	}

	offClose(cb: VoidHandler) {
		this.closeListeners.delete(cb);
	}

	offMessage(cb: MessageHandler) {
		this.messageListeners.delete(cb);
	}

	/* -------- socket controls -------- */

	send(data: WSClientMessage) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
		this.ws.send(typeof data === "string" ? data : JSON.stringify(data));
		return true;
	}

	private connect() {
		clearTimeout(this.reconnectTimer);

		this.ws = new WebSocket(import.meta.env.VITE_WS_BASE_URL);

		this.ws.onopen = () => {
			this.reconnectAttempts = 0;
			this.connectionSignal[1](true);
			this.startHeartbeat();
			emit(this.openListeners);
		};

		this.ws.onmessage = (ev) => {
			const msg = JSON.parse(ev.data) as WSServerMessage;

			if (msg.type === "pong") {
				clearTimeout(this.pongTimeout);
				return;
			}

			emit(this.messageListeners, ev);

			const listeners = this.typedListeners.get(msg.type);
			if (listeners) emit(listeners, msg.data);
		};

		this.ws.onclose = () => {
			this.stopHeartbeat();
			this.connectionSignal[1](false);
			this.authorizationSignal[1](false);
			emit(this.closeListeners);
			this.scheduleReconnect();
		};

		this.ws.onerror = () => {
			this.stopHeartbeat();
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

	private startHeartbeat() {
		this.stopHeartbeat();

		this.pingInterval = window.setInterval(() => {
			if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

			const ts = Date.now();
			this.send({ type: "ping", data: { ts } });

			clearTimeout(this.pongTimeout);
			this.pongTimeout = window.setTimeout(() => {
				console.warn("WS pong timeout → reconnecting");
				this.ws?.close();
			}, this.PONG_TIMEOUT);
		}, this.PING_EVERY);
	}

	private stopHeartbeat() {
		clearInterval(this.pingInterval);
		clearTimeout(this.pongTimeout);
	}

	public authenticate(token: string) {
		this.send({
			type: "auth",
			data: { token },
		});
	}
}

export const ws = WebSocketSingleton.getInstance();
