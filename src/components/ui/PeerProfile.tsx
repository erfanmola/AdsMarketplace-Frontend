import { type Component, createSignal, onMount, Show } from "solid-js";
import "./PeerProfile.scss";
import { getNameInitials } from "../../utils/general";
import ImageLoader from "./ImageLoader";

type PeerProfileProps = {
	peerId: number;
	name: string;
	username?: string;
	class?: string;
};

export const PeerColors = [
	{ slug: "red", from: "#FF885E", to: "#FF516A" },
	{ slug: "orange", from: "#FFCD6A", to: "#FFA85C" },
	{ slug: "violet", from: "#82B1FF", to: "#665FFF" },
	{ slug: "green", from: "#A0DE7E", to: "#54CB68" },
	{ slug: "cyan", from: "#53EDD6", to: "#28C9B7" },
	{ slug: "blue", from: "#72D5FD", to: "#2A9EF1" },
	{ slug: "pink", from: "#E0A2F3", to: "#D669ED" },
];

export const PeerColorArchived = {
	slug: "archived",
	from: "#B8C2CC",
	to: "#9EAAB5",
};

const PeerProfile: Component<PeerProfileProps> = (props) => {
	const getIndex = (s: string, len: number) =>
		Array.from(s).reduce((h, c) => (h * 31 + c.codePointAt(0)!) >>> 0, 0) % len;

	let color = props.peerId
		? PeerColors[Math.abs(+props.peerId) % PeerColors.length]
		: PeerColors[getIndex(props.name ?? "", PeerColors.length)];

	if (props.peerId === -1) {
		color = PeerColorArchived;
	}

	const [imageLoaded, setImageLoaded] = createSignal(false);

	const imageUrl = `https://t.me/i/userpic/320/${props.username}.jpg`;

	onMount(() => {
		if (!props.username) return;

		const img = new Image();
		img.src = imageUrl;

		img.onload = () => {
			if (img.width > 1) {
				setImageLoaded(true);
			} else {
				setImageLoaded(false);
			}
		};

		img.onerror = () => {
			setImageLoaded(false);
		};
	});

	return (
		<div
			class={["peer-profile", props.class].filter(Boolean).join(" ")}
			style={{
				"--color-from": color.from,
				"--color-to": color.to,
			}}
		>
			<Show
				when={props.username && imageLoaded()}
				fallback={<span>{getNameInitials(props.name).toUpperCase()}</span>}
			>
				<ImageLoader src={imageUrl} />
			</Show>
		</div>
	);
};

export default PeerProfile;
