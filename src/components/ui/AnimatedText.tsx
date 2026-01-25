import {
	type Component,
	createEffect,
	createMemo,
	createSignal,
	on,
} from "solid-js";
import "./AnimatedText.scss";
import { motionMultipler } from "../../utils/motion";

export type AnimatedTextProps = {
	text: string;
	duration?: number;
};

const AnimatedText: Component<AnimatedTextProps> = (props) => {
	const [current, setCurrent] = createSignal(props.text);
	const [previous, setPrevious] = createSignal("");
	const [animating, setAnimating] = createSignal(false);

	const duration = createMemo(
		() => (props.duration ?? 220) * motionMultipler(),
	);

	createEffect(
		on(
			() => props.text,
			() => {
				setAnimating(true);
				setPrevious(current());
				setCurrent(props.text);

				setTimeout(() => {
					setAnimating(false);
				}, duration());
			},
			{
				defer: true,
			},
		),
	);

	return (
		<div
			class="animated-text"
			classList={{
				animating: animating(),
			}}
			style={{ "--animation-duration": `${duration()}ms` }}
		>
			<span class="previous">{previous()}</span>

			<span class="current">{current()}</span>
		</div>
	);
};

export default AnimatedText;
