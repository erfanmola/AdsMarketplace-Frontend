import { type Component, createMemo, Show } from "solid-js";
import "./StatsDiff.scss";

type StatsDiffProps = {
	current: number;
	previous: number;
	reverse?: boolean;
};

const StatsDiff: Component<StatsDiffProps> = (props) => {
	const diff = createMemo(() => props.current - props.previous);
	const growth = createMemo(() => {
		const sign = diff() > 0;

		if (diff() === 0) return undefined;

		if (props.reverse) {
			return !sign;
		}

		return sign;
	});

	return (
		<span
			class="stats-diff"
			classList={{
				"stats-diff-grow": growth(),
				"stats-diff-shrink": growth() === false,
			}}
		>
			<Show when={growth() !== undefined}>
				{diff() > 0 ? "+" : ""}
				{diff()}
				{` (${props.previous === 0 ? (props.current !== 0 ? "∞" : "0") : Math.trunc((Math.abs(props.current - props.previous) / props.previous) * 1000) / 10}%)`}
			</Show>
		</span>
	);
};

export default StatsDiff;
