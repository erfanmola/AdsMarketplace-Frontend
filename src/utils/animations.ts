import OutlineDuckAcceptMoney from "../assets/outlines/duck-accept-money-outline.svg?raw";
import OutlineDuckAuction from "../assets/outlines/duck-auction-outline.svg?raw";
import OutlineDuckCelebrate from "../assets/outlines/duck-celebrate-outline.svg?raw";
import OutlineDuckChartGrow from "../assets/outlines/duck-chart-grow-outline.svg?raw";
import OutlineDuckEgg from "../assets/outlines/duck-egg-outline.svg?raw";
import OutlineDuckForbidden from "../assets/outlines/duck-forbidden-outline.svg?raw";
import OutlineDuckGlassShine from "../assets/outlines/duck-glass-shine-outline.svg?raw";
import OutlineDuckHashtags from "../assets/outlines/duck-hashtags-outline.svg?raw";
import OutlineDuckLaunchPlane from "../assets/outlines/duck-launch-plane-outline.svg?raw";
import OutlineDuckMoney from "../assets/outlines/duck-money-outline.svg?raw";
import OutlineDuckPremiumCloak from "../assets/outlines/duck-premium-cloak-outline.svg?raw";
import OutlineDuckTransparent from "../assets/outlines/duck-transparent-outline.svg?raw";
import OutlineEmojiChart from "../assets/outlines/emoji-chart-outline.svg?raw";

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
		premiumCloak: {
			url: "/assets/tgs/duck-premium-cloak.tgs",
			outline: OutlineDuckPremiumCloak,
		},
		money: {
			url: "/assets/tgs/duck-money.tgs",
			outline: OutlineDuckMoney,
		},
		forbidden: {
			url: "/assets/tgs/duck-forbidden.tgs",
			outline: OutlineDuckForbidden,
		},
	},
	emoji: {
		chart: {
			url: "/assets/tgs/emoji-chart.tgs",
			outline: OutlineEmojiChart,
		},
	},
};
