import tailwindcss from "@tailwindcss/vite";
import devtools from "solid-devtools/vite";
import { defineConfig, type UserConfig } from "vite";
import pluginPurgeCss from "vite-plugin-purgecss";
import solid from "vite-plugin-solid";
import solidSvg from "vite-plugin-solid-svg";

export default defineConfig((config) => {
	const isDevMode = config.mode === "development";

	const userConfig: UserConfig = {
		plugins: [
			tailwindcss(),
			solid(),
			solidSvg(),
			pluginPurgeCss({
				variables: true,
				keyframes: true,
				content: ["./src/**/*.tsx"],
				safelist: {
					standard: [
						// Core roots
						":root",
						"html",
						"body",
						"#root",

						// Text & grouping
						"div",
						"span",
						"p",
						"a",
						"strong",
						"b",
						"em",
						"i",
						"small",
						"mark",
						"code",
						"pre",
						"blockquote",
						"hr",

						// Headings
						"h1",
						"h2",
						"h3",
						"h4",
						"h5",
						"h6",

						// Lists
						"ul",
						"ol",
						"li",
						"dl",
						"dt",
						"dd",

						// Layout / semantic
						"main",
						"section",
						"article",
						"aside",
						"header",
						"footer",
						"nav",
						"figure",
						"figcaption",

						// Forms & inputs
						"form",
						"label",
						"input",
						"textarea",
						"select",
						"option",
						"optgroup",
						"button",
						"fieldset",
						"legend",
						"datalist",
						"output",
						"progress",
						"meter",

						// Media
						"img",
						"picture",
						"source",
						"video",
						"audio",
						"canvas",
						"iframe",
						"embed",
						"object",

						// Tables
						"table",
						"thead",
						"tbody",
						"tfoot",
						"tr",
						"th",
						"td",
						"caption",
						"col",
						"colgroup",

						// SVG
						"svg",
						"g",
						"path",
						"circle",
						"rect",
						"line",
						"polyline",
						"polygon",
						"text",

						// Misc
						"details",
						"summary",
						"dialog",
						"template",
					],
					greedy: [
						/container-/,
						/modal-/,
						/data-theme/,
						/lottie-animation/,
						/transition-/,
						/container-pull-to-refresh/,
						/shimmer/,
						/tchart/,
						/tw/,
						/section/,
						/badge/,
						/^p/,
						/^m/,
						/^start/,
						/^end/,
					],
				},
				defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
			}) as any,
			{
				name: "build-info:generated",
				resolveId(id) {
					if (id === "build-info:generated") {
						return id;
					}
				},
				load(id) {
					if (id === "build-info:generated") {
						return `
                     export const BUILD_ID = "${Math.floor(
												Math.random() * 0xffffffff,
											)
												.toString(16)
												.padStart(8, "0")
												.substring(0, 6)
												.toUpperCase()}";
                     export const BUILD_TIME = ${Date.now()};
                  `;
					}
				},
			},
		],
		server: {
			cors: {
				allowedHeaders: "*",
				origin: "*",
			},
		},
		envDir: "./",
		build: {
			rollupOptions: {
				output: {
					manualChunks: {
						svgAssets: ["solid-icons"],
						tchart: ["src/lib/tchart/chart.ts"],
					},
				},
			},
		},
	};

	if (!isDevMode) {
		userConfig.plugins?.push(devtools());
	}

	return userConfig;
});
