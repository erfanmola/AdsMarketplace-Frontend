import { type Component, createEffect, For, on, type Setter } from "solid-js";
import "./RangeSlider.scss";
import { invokeHapticFeedbackSelectionChanged } from "../../utils/telegram";

type RangeSliderProps = {
	value: number;
	setValue: Setter<number>;
	min: number;
	max: number;
	step: number;
};

const RangeSlider: Component<RangeSliderProps> = (props) => {
	createEffect(
		on(
			() => props.value,
			() => {
				invokeHapticFeedbackSelectionChanged();
			},
			{
				defer: true,
			},
		),
	);

	return (
		<div
			class="range-slider"
			style={{
				"--filled": `${(props.value / (props.max - props.min)) * 100}%`,
			}}
		>
			<input
				class="swiper-no-swiping"
				type="range"
				min={props.min}
				max={props.max}
				step={props.step}
				value={props.value}
				onInput={(e) => {
					props.setValue(Number.parseInt(e.currentTarget.value, 10));
				}}
				onPointerDown={() => {
					invokeHapticFeedbackSelectionChanged();
				}}
			/>

			<ul>
				<For
					each={Array.from(new Array((props.max - props.min) / props.step + 1))}
				>
					{(_, i) => (
						<li
							onClick={() => props.setValue(i() * props.step)}
							classList={{ passed: props.value >= i() * props.step }}
						>
							{i() * props.step}
						</li>
					)}
				</For>
			</ul>
		</div>
	);
};

export default RangeSlider;
