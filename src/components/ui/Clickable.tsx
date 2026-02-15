import type { ParentComponent } from "solid-js";
import "./Clickable.scss";

type ClickableProps = {
	class?: string;
	id?: string;
	onClick?: (e: MouseEvent) => void;
	disabled?: boolean;
};

const Clickable: ParentComponent<ClickableProps> = (props) => {
	return (
		<div
			id={props.id}
			class={["clickable", props.class].filter(Boolean).join(" ")}
			classList={{ disabled: props.disabled }}
			onClick={props.onClick}
		>
			{props.children}
		</div>
	);
};

export default Clickable;
