import {
	BiSolidCheckCircle,
	BiSolidErrorCircle,
	BiSolidInfoCircle,
} from "solid-icons/bi";
import "./Toast.scss";
import { type Component, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import solidToast, { type Toast, type ToastPosition } from "solid-toast";

type ToastParams = {
	duration?: number;
	icon?: Component;
	text: string;
	class?: string;
	position?: ToastPosition;
	onClick?: (t: Toast) => void;
};

export const toast = (params: ToastParams) =>
	solidToast.custom(
		(t) => (
			<div
				class={["toast", params.class].filter(Boolean).join(" ")}
				classList={{
					"animate-enter": t.visible,
					"animate-leave": !t.visible,
				}}
				onClick={() => {
					params.onClick?.(t);
				}}
			>
				<Show when={params.icon}>
					<Dynamic component={params.icon} />
				</Show>
				<span>{params.text}</span>
			</div>
		),
		{
			duration: params.duration,
			position: params.position ?? "bottom-center",
		},
	);

export const toastNotification = (
	params: Omit<ToastParams, "icon"> & { type: "error" | "success" | "info" },
) => {
	return toast({
		text: params.text,
		class: params.class,
		duration: params.duration,
		onClick: params.onClick,
		position: params.position,
		icon: () => {
			switch (params.type) {
				case "error":
					return <BiSolidErrorCircle />;
				case "success":
					return <BiSolidCheckCircle />;
				case "info":
					return <BiSolidInfoCircle />;
			}
		},
	});
};
