import OutlineDuckAcceptMoney from "../assets/outlines/duck-accept-money-outline.svg?raw";
import OutlineDuckAuction from "../assets/outlines/duck-auction-outline.svg?raw";
import OutlineDuckCelebrate from "../assets/outlines/duck-celebrate-outline.svg?raw";
import OutlineDuckChartGrow from "../assets/outlines/duck-chart-grow-outline.svg?raw";
import OutlineDuckChatting from "../assets/outlines/duck-chatting-outline.svg?raw";
import OutlineDuckEgg from "../assets/outlines/duck-egg-outline.svg?raw";
import OutlineDuckGlassShine from "../assets/outlines/duck-glass-shine-outline.svg?raw";
import OutlineDuckHashtags from "../assets/outlines/duck-hashtags-outline.svg?raw";
import OutlineDuckLaunchPlane from "../assets/outlines/duck-launch-plane-outline.svg?raw";
import OutlineDuckTransparent from "../assets/outlines/duck-transparent-outline.svg?raw";

export type LottieAnimation = {
	url: string;
	outline: string;
};

export const LottieAnimations: {
	[key: string]: { [key: string]: LottieAnimation };
} = {
	duck: {
		glassShine: {
			url: "/assets/tgs/duck-glass-shine.tgs",
			outline: OutlineDuckGlassShine,
		},
		auction: {
			url: "/assets/tgs/duck-auction.tgs",
			outline: OutlineDuckAuction,
		},
		chatting: {
			url: "/assets/tgs/duck-chatting.tgs",
			outline: OutlineDuckChatting,
		},
		chartGrow: {
			url: "/assets/tgs/duck-chart-grow.tgs",
			outline: OutlineDuckChartGrow,
		},
		celebrate: {
			url: "/assets/tgs/duck-celebrate.tgs",
			outline: OutlineDuckCelebrate,
		},
		egg: {
			url: "/assets/tgs/duck-egg.tgs",
			outline: OutlineDuckEgg,
		},
		launchPlane: {
			url: "/assets/tgs/duck-launch-plane.tgs",
			outline: OutlineDuckLaunchPlane,
		},
		transparent: {
			url: "/assets/tgs/duck-transparent.tgs",
			outline: OutlineDuckTransparent,
		},
		acceptMoney: {
			url: "/assets/tgs/duck-accept-money.tgs",
			outline: OutlineDuckAcceptMoney,
		},
		hashtags: {
			url: "/assets/tgs/duck-hashtags.tgs",
			outline: OutlineDuckHashtags,
		},
	},
};
