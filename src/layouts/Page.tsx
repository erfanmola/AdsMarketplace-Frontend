import { type Component, type ParentComponent, Show } from "solid-js";
import "./Page.scss";
import { Dynamic } from "solid-js/web";

type PageProps = {
	title?: string;
	id?: string;
	class?: string;
	headerPrepend?: Component;
	headerAppend?: Component;
	footer?: Component;
};

const Page: ParentComponent<PageProps> = (props) => {
	return (
		<div id={props.id} class={["page", props.class].filter(Boolean).join(" ")}>
			<Show when={props.title || props.headerAppend || props.headerPrepend}>
				<header>
					<Show when={props.headerPrepend}>
						<div class="page-header-prepend">
							<Dynamic component={props.headerPrepend} />
						</div>
					</Show>

					<Show when={props.title}>
						<h1>{props.title}</h1>
					</Show>

					<Show when={props.headerAppend}>
						<div class="page-header-append">
							<Dynamic component={props.headerAppend} />
						</div>
					</Show>
				</header>
			</Show>

			<div>{props.children}</div>

			<Show when={props.footer}>
				<footer>
					<Dynamic component={props.footer} />
				</footer>
			</Show>
		</div>
	);
};

export default Page;
