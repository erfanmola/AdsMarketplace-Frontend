import { type Component, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import "./Placeholder.scss";

type PlaceholderProps = {
	title?: string;
	description?: string;
	symbol?: Component;
	button?: Component;
};

const Placeholder: Component<PlaceholderProps> = (props) => {
	return (
		<div class="container-placeholder">
			<Show when={props.symbol}>
				<div>
					<Dynamic component={props.symbol} />
				</div>
			</Show>

			<Show when={props.title}>
				<span>{props.title}</span>
			</Show>

			<Show when={props.description}>
				<p>{props.description}</p>
			</Show>

			<Show when={props.button}>
				<footer>
					<Dynamic component={props.button} />
				</footer>
			</Show>
		</div>
	);
};

export default Placeholder;
