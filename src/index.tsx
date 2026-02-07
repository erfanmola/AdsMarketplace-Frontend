import "./scss/app.scss";
import "./scss/tailwind.css";

/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

const root = document.getElementById("root");

render(() => <App />, root!);

declare module "solid-js" {
	namespace JSX {
		interface IntrinsicElements {
			"swiper-container": any;
			"swiper-slide": any;
		}
	}
}
