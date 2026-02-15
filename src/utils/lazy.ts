import type { TonConnectUI } from "@tonconnect/ui";

export let tonConnectUI: TonConnectUI | undefined;

export let parseTONAddress: (
	hexAddress: string,
	testOnly?: boolean,
) => string | undefined;

export const initializeTonConnect = async () => {
	if (tonConnectUI) return true;

	try {
		const { THEME, TonConnectUI, toUserFriendlyAddress } = await import(
			"@tonconnect/ui"
		);
		const darkMode = document.body.getAttribute("data-theme") === "dark";

		parseTONAddress = toUserFriendlyAddress;

		tonConnectUI = new TonConnectUI({
			manifestUrl: `${import.meta.env.VITE_APP_BASE_URL}/tonconnect-manifest.json`,
			uiPreferences: {
				theme: darkMode ? THEME.DARK : THEME.LIGHT,
			},
			restoreConnection: true,
			walletsRequiredFeatures: {
				sendTransaction: {
					minMessages: 2,
				},
			},
			actionsConfiguration: {
				twaReturnUrl: `https://t.me/${import.meta.env.VITE_BOT_USERNAME}/${import.meta.env.VITE_MINIAPP_SLUG}`,
			},
			analytics: {
				mode: "off",
			},
		});

		return true;
	} catch (error) {
		console.error("Failed to initialize TonConnectUI:", error);
	}

	return false;
};
