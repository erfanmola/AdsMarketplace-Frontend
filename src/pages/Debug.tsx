import { VsBracketError } from "solid-icons/vs";
import Page from "../layouts/Page";
import "./Debug.scss";
import type { Component } from "solid-js";

const PageDebug: Component = () => {
	return (
		<Page
			id="container-page-debug"
			title="Debug"
			headerPrepend={() => (
				<VsBracketError
					style={{ "font-size": "1.75rem", color: "var(--accent)" }}
				/>
			)}
		>
			Debug Content
		</Page>
	);
};

export default PageDebug;
