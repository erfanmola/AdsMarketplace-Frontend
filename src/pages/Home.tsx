import Page from "../layouts/Page";
import { navigator } from "../utils/navigator";
import "./Home.scss";

import type { Component } from "solid-js";

const PageHome: Component = () => {
	navigator.go("/debug");
	return (
		<Page id="container-page-home" title="Home">
			Home Content
		</Page>
	);
};

export default PageHome;
