import {
	type Component,
	createEffect,
	createSignal,
	For,
	on,
	onCleanup,
	onMount,
} from "solid-js";
import "./BottomBar.scss";
import { Dynamic } from "solid-js/web";
import { useTranslation } from "../../contexts/TranslationContext";
import { hideKeyboard } from "../../utils/input";
import { motionMultipler } from "../../utils/motion";
import { clamp } from "../../utils/number";
import { invokeHapticFeedbackImpact } from "../../utils/telegram";
import { SVGSymbol } from "../SVG";

export type BottomBarItem = {
	icon: Component;
	title: string;
};

type BottomBarProps = {
	items: BottomBarItem[];
	search?: boolean;
	onSearchInput?: (query: string) => void;
	onSearchEnter?: (query: string) => void;
	initialIndex?: number;
	onIndexChange?: (index: number) => void;
	onSearchToggle?: (visible: boolean) => void;
	searchToggle?: boolean;
	initialSearchQuery?: string;
};

const BottomBar: Component<BottomBarProps> = (props) => {
	const [active, setActive] = createSignal(props.initialIndex ?? 0);
	const [search, setSearch] = createSignal(props.initialSearchQuery ?? "");
	const [searchToggle, setSearchToggle] = createSignal(
		props.searchToggle ?? false,
	);
	const { t } = useTranslation();

	createEffect(
		on(
			searchToggle,
			(visible) => {
				props.onSearchToggle?.(visible);
			},
			{
				defer: true,
			},
		),
	);

	createEffect(
		on(
			() => props.searchToggle,
			(visible) => {
				if (typeof visible === "undefined") return;
				setSearchToggle(props.searchToggle!);
			},
			{
				defer: true,
			},
		),
	);

	createEffect(
		on(
			() => props.initialSearchQuery,
			(query) => {
				if (typeof query === "undefined") return;
				setSearch(query);
			},
			{
				defer: true,
			},
		),
	);

	const BottomBarList = () => {
		createEffect(
			on(
				active,
				() => {
					props.onIndexChange?.(active());
					setSearch("");
				},
				{
					defer: true,
				},
			),
		);

		let ulRef!: HTMLUListElement;
		let dragging = false;
		let pressed = false;
		let startX = 0;
		let longpressTimer = 0;
		let previousCloset: HTMLElement | undefined;
		const DRAG_THRESHOLD = 8;

		const updateDistance = () => {
			const ulRect = ulRef.getBoundingClientRect();
			const containerRect = ulRef.parentElement!.getBoundingClientRect();

			ulRef.style.setProperty(
				"--pill-distance",
				`${-1 * (ulRect.left - containerRect.left)}px`,
			);
		};

		const updateIndicator = () => {
			const active = ulRef.querySelector("li.active") as HTMLElement;
			if (!active) return;

			const ulRect = ulRef.getBoundingClientRect();
			const liRect = active.getBoundingClientRect();

			ulRef.style.setProperty("--pill-x", `${liRect.left - ulRect.left}px`);
			ulRef.style.setProperty("--pill-w", `${liRect.width}px`);
			ulRef.style.setProperty("--pill-h", `${liRect.height}px`);
		};

		const movePillToX = (x: number) => {
			const ulRect = ulRef.getBoundingClientRect();
			const pillW = parseFloat(
				getComputedStyle(ulRef).getPropertyValue("--pill-w"),
			);

			const clamped = clamp(
				x - ulRect.left - pillW / 2,
				0,
				ulRect.width - pillW,
			);

			ulRef.style.setProperty("--pill-x", `${clamped}px`);
		};

		const onRelease = (x: number) => {
			const ulRect = ulRef.getBoundingClientRect();
			const localX = x - ulRect.left;

			const items = [...ulRef.querySelectorAll("li")] as HTMLElement[];

			const closest = items.reduce((a, b) => {
				return Math.abs(b.offsetLeft + b.offsetWidth / 2 - localX) <
					Math.abs(a.offsetLeft + a.offsetWidth / 2 - localX)
					? b
					: a;
			});

			closest.click();

			setTimeout(() => {
				for (const el of ulRef.querySelectorAll("li")) {
					el.classList.remove("hover");
				}
			});
		};

		onMount(() => {
			updateDistance();
			updateIndicator();
			window.addEventListener("resize", updateIndicator, {
				passive: true,
			});
			window.addEventListener("resize", updateDistance, {
				passive: true,
			});

			const down = (e: PointerEvent) => {
				pressed = true;
				dragging = false;
				startX = e.clientX;
				ulRef.setPointerCapture(e.pointerId);

				longpressTimer = setTimeout(() => {
					invokeHapticFeedbackImpact("light");
					dragging = true;
					ulRef.style.setProperty("--pill-s", "1.25");
					movePillToX(e.clientX);

					const ulRect = ulRef.getBoundingClientRect();
					const localX = e.clientX - ulRect.left;

					const items = [...ulRef.querySelectorAll("li")] as HTMLElement[];

					const closest = items.reduce((a, b) => {
						return Math.abs(b.offsetLeft + b.offsetWidth / 2 - localX) <
							Math.abs(a.offsetLeft + a.offsetWidth / 2 - localX)
							? b
							: a;
					});

					closest.classList.add("hover");

					previousCloset = closest;

					setTimeout(() => {
						ulRef.classList.add("dragging");
					}, 150 * motionMultipler());
				}, 150);
			};

			const move = (e: PointerEvent) => {
				if (!pressed) return;

				const dx = Math.abs(e.clientX - startX);

				if (!dragging && dx > DRAG_THRESHOLD) {
					clearTimeout(longpressTimer);

					invokeHapticFeedbackImpact("light");
					dragging = true;
					ulRef.style.setProperty("--pill-s", "1.25");
					ulRef.classList.add("dragging");
				}

				if (!dragging) return;
				movePillToX(e.clientX);

				const ulRect = ulRef.getBoundingClientRect();
				const localX = e.clientX - ulRect.left;

				const items = [...ulRef.querySelectorAll("li")] as HTMLElement[];

				const closest = items.reduce((a, b) => {
					return Math.abs(b.offsetLeft + b.offsetWidth / 2 - localX) <
						Math.abs(a.offsetLeft + a.offsetWidth / 2 - localX)
						? b
						: a;
				});

				if (previousCloset && previousCloset !== closest) {
					invokeHapticFeedbackImpact("light");
					previousCloset.classList.remove("hover");
					closest.classList.add("hover");
				} else {
					closest.classList.add("hover");
				}

				previousCloset = closest;
			};

			const up = (e: PointerEvent) => {
				clearTimeout(longpressTimer);
				pressed = false;
				dragging = false;
				startX = 0;
				previousCloset = undefined;
				ulRef.style.setProperty("--pill-s", "1");
				ulRef.classList.remove("dragging");
				ulRef.releasePointerCapture(e.pointerId);
				onRelease(e.clientX);
			};

			ulRef.addEventListener("pointerdown", down, {
				passive: true,
			});
			ulRef.addEventListener("pointermove", move, {
				passive: true,
			});
			ulRef.addEventListener("pointerup", up, {
				passive: true,
			});
			ulRef.addEventListener("pointercancel", up, {
				passive: true,
			});

			onCleanup(() => {
				window.removeEventListener("resize", updateIndicator);
				window.removeEventListener("resize", updateDistance);
				ulRef.removeEventListener("pointerdown", down);
				ulRef.removeEventListener("pointermove", move);
				ulRef.removeEventListener("pointerup", up);
				ulRef.removeEventListener("pointercancel", up);
			});
		});

		const onClick = (index: number) => {
			setActive(index);
			requestAnimationFrame(updateIndicator);
		};

		return (
			<ul ref={ulRef}>
				<For each={props.items}>
					{(item, index) => (
						<li
							onClick={() => onClick(index())}
							classList={{ active: active() === index() }}
						>
							<Dynamic component={item.icon} />
							<span>{item.title}</span>
						</li>
					)}
				</For>
			</ul>
		);
	};

	const BottomBarSearch = () => {
		let inputRef: HTMLInputElement | undefined;

		const onClickSearchToggle = () => {
			if (searchToggle()) return;

			invokeHapticFeedbackImpact("soft");
			setSearchToggle(true);
		};

		const onClickSearchToggleClose = () => {
			if (!searchToggle()) return;

			invokeHapticFeedbackImpact("soft");
			setSearchToggle(false);
		};

		createEffect(
			on(
				search,
				() => {
					props.onSearchInput?.(search());
				},
				{
					defer: true,
				},
			),
		);

		return (
			<div classList={{ visible: props.search }} id="container-search">
				<div>
					<span onClick={onClickSearchToggle}>
						<span class="clickable">
							<SVGSymbol id="CgSearch" />
						</span>
					</span>

					<input
						type="text"
						value={search()}
						onInput={(e) => setSearch(e.target.value)}
						placeholder={t("components.bottomBar.search.title")}
						ref={inputRef}
						inputMode="search"
						onKeyUp={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								hideKeyboard();
								props.onSearchEnter?.(search());
							}
						}}
					/>

					<button
						class="clickable"
						classList={{ visible: search().trim().length > 0 }}
						type="button"
						onClick={() => {
							invokeHapticFeedbackImpact("soft");
							setSearch("");
						}}
					>
						<SVGSymbol id="IoClose" />
					</button>
				</div>

				<span class="clickable" onClick={onClickSearchToggleClose}>
					<span class="clickable">
						<SVGSymbol id="IoClose" />
					</span>
				</span>
			</div>
		);
	};

	return (
		<div
			id="container-bottombar"
			classList={{ searchable: props.search, search: searchToggle() }}
		>
			<BottomBarList />

			<BottomBarSearch />
		</div>
	);
};

export default BottomBar;
