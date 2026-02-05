import { type Component, createEffect, on, onCleanup, onMount } from "solid-js";
import TChart from "../../lib/tchart/chart";
import type { TChartData, TChartSettings } from "../../lib/tchart/types";
import { Color } from "../../utils/color";
import { theme } from "../../utils/telegram";
import "./TelegramChart.scss";
import { useTranslation } from "../../contexts/TranslationContext";

export type ChartData = {
	title: string;
	columns: [string, ...number[]][];
	types: Record<string, string>;
	names: Record<string, string>;
	colors: Record<string, string>;
	hidden: string[];
	subchart: {
		show: boolean;
		defaultZoom: number[];
	};
	strokeWidth: number;
	xTickFormatter: string;
	xTooltipFormatter: string;
	xRangeFormatter: string;
	yTickFormatter: string;
	yTooltipFormatter: string;
	tooltipSort: null;
	stacked?: boolean;
	y_scaled?: boolean;
	percentage?: boolean;
	tooltipsOnHover?: boolean;
};

type TelegramChartProps = {
	data: ChartData;
	settings?: Partial<TChartSettings>;
};

const TelegramChart: Component<TelegramChartProps> = (props) => {
	let container: HTMLDivElement | undefined;

	const { t } = useTranslation();

	const ChartColors = () => ({
		primary: new Color(
			getComputedStyle(document.body).getPropertyValue("--accent").trim(),
		).toHex(),
		secondary: new Color([
			...new Color(getComputedStyle(document.body).color).toRGB().slice(0, 3),
			0.75,
		]).toRGBString(),
		background: new Color(
			getComputedStyle(document.body)
				.getPropertyValue("--section-bg-color")
				.trim(),
		).toHex(),
		backgroundRgb: new Color(
			getComputedStyle(document.body)
				.getPropertyValue("--section-bg-color")
				.trim(),
		)
			.toRGB()
			.slice(0, 3),
		text: new Color(getComputedStyle(document.body).color).toHex(),
		dates: new Color([
			...new Color(getComputedStyle(document.body).color).toRGB().slice(0, 3),
			0.75,
		]).toRGBString(),
		grid: new Color([
			...new Color(getComputedStyle(document.body).color).toRGB().slice(0, 3),
			0.2,
		]).toRGBString(),
		axis: {
			x: new Color([
				...new Color(getComputedStyle(document.body).color).toRGB().slice(0, 3),
				0.5,
			]).toRGBString(),
			y: new Color([
				...new Color(getComputedStyle(document.body).color).toRGB().slice(0, 3),
				0.5,
			]).toRGBString(),
		},
		barsSelectionBackground: new Color([
			...new Color(getComputedStyle(document.body).color).toRGB().slice(0, 3),
			0.125,
		]).toRGBString(),
		miniMask: new Color([
			...new Color(getComputedStyle(document.body).color).toRGB().slice(0, 3),
			0.125,
		]).toRGBString(),
		miniFrame: new Color([
			...new Color(getComputedStyle(document.body).color).toRGB().slice(0, 3),
			0.425,
		]).toRGBString(),
	});

	const getLabelDate: TChartData["getLabelDate"] = (value, options = {}) => {
		options.displayYear ??= true;
		options.isMonthShort ??= true;

		return new Date(value).toLocaleDateString(undefined, {
			weekday: options.displayWeekDay
				? options.isShort
					? "short"
					: "long"
				: undefined,
			year: options.displayYear ? "numeric" : undefined,
			hour: options.displayHours ? "2-digit" : undefined,
			minute: options.displayHours ? "2-digit" : undefined,
			month: options.isMonthShort ? "short" : "long",
			day: "numeric",
		});
	};

	const getLabelTime: TChartData["getLabelTime"] = (value: number) => {
		return new Date(value).toLocaleTimeString(undefined, {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const prepareData = (data: ChartData, percentage?: boolean) => {
		for (const i in data.colors) {
			const color = data.colors[i];
			data.colors[i] = color.substring(color.indexOf("#"));
		}

		if (percentage)
			for (const i in data.types) {
				if (data.types[i] === "bar") {
					data.types[i] = "area";
				}
			}

		return data;
	};

	onMount(() => {
		if (!container) return;

		const chart = TChart.render({
			container,
			data: {
				...prepareData(props.data, props.data.percentage),
				getLabelDate,
				getLabelTime,
				tooltipOnHover: props.data.tooltipsOnHover ?? true,
			} as any,
			settings: {
				darkMode: theme() === "dark",
				ALL_LABEL: t("components.telegramChart.all"),
				DATES_SIDE: "left",
				DATES_WEIGHT: "normal",
				DATES_FONT_SIZE: 14,
				ZOOM_TEXT: t("components.telegramChart.zoomOut"),
				FONT: {
					family: `Inter, Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif`,
					bold: "500",
					normal: "400",
				},
				COLORS: ChartColors() as any,
			},
		});

		createEffect(
			on(theme, () => {
				setTimeout(() => {
					const colors = ChartColors() as any;

					const p: [property: string, value: string][] = [
						["primary-color", colors.primary],
						["background-color", colors.background],
						["background-color-rgb", colors.backgroundRgb.join(", ")],
						["text-color", colors.text],
						["secondary-color", colors.secondary],
					];

					p.forEach(([property, value]) => {
						chart.$wrapper.style.setProperty(`--tchart-${property}`, value);
					});

					chart.setDarkMode(theme() === "dark", { ...colors });
				});
			}),
		);

		onCleanup(() => {
			container?.remove();
			container = undefined;
		});
	});

	return <div ref={container}></div>;
};

export default TelegramChart;
