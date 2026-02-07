import { type ParentComponent, Show } from "solid-js";
import "./Section.scss";

type SectionProps = {
	type?: "default" | "tint" | "glass";
	class?: string;
	title?: string;
	subtitle?: string;
	description?: string;
};

const Section: ParentComponent<SectionProps> = (props) => {
	return (
		<section
			class={["section", `section-${props.type ?? "default"}`, props.class]
				.filter(Boolean)
				.join(" ")}
		>
			<Show when={props.title}>
				<span
					class="title"
					classList={{ withSubtitle: Boolean(props.subtitle) }}
				>
					{props.title}

					<Show when={props.subtitle}>
						<span class="subtitle">{props.subtitle}</span>
					</Show>
				</span>
			</Show>

			<div>{props.children}</div>

			<Show when={props.description}>
				<span class="description">{props.description}</span>
			</Show>
		</section>
	);
};

export default Section;
