import "./Debug.scss";

import { VsBracketError } from "solid-icons/vs";
import type { Component } from "solid-js";
import Page from "../layouts/Page";

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
		></Page>
	);
};

export default PageDebug;
