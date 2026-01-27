const dict = {
	locales: {
		en: "English",
		fa: "فارسی",
		ar: "العربية",
		de: "Deutsch",
		ru: "Русский",
		hi: "हिन्दी",
	},
	general: {},
	pages: {
		error: {
			title: "Error",
			description: "An error occurred.",
			data: {
				error: {
					title: "Something went wrong",
					description: "We couldn’t fetch data, try reloading the app.",
				},
			},
		},
		errorInvalidEnv: {
			title: "Invalid Environment",
			description:
				"This app is designed to run in Telegram Mini Apps environment.",
		},
		intro: {
			sections: {
				intro: {
					title: "Not Boost",
					description:
						"A fair, secure, and automated ad marketplace for Telegram. Your ads, your rules.",
				},
				advertisers: {
					title: "Advertisers",
					description:
						"Launch campaigns with confidence. Escrow ensures your payments are safe until results are delivered.",
				},
				publishers: {
					title: "Publishers",
					description:
						"Get paid securely and on time. Our automated flow guarantees transparency and fairness for every ad.",
				},
				flow: {
					title: "Transparency",
					description:
						"Every step tracked. Escrow-protected payments. Automated processes that work for both sides.",
				},
				done: {
					title: "Ready?",
					description:
						"Start advertising or monetizing your channel with full confidence and zero hassle.",
				},
			},
			button: {
				start: "Let's Start",
			},
		},
		home: {},
		advertisers: {},
		publishers: {},
		profile: {},
	},
	components: {
		bottomBar: {
			items: {
				home: {
					title: "Home",
				},
				advertisers: {
					title: "Advertisers",
				},
				publishers: {
					title: "Publishers",
				},
				profile: {
					title: "Profile",
				},
			},
			search: {
				title: "Search",
			},
		},
	},
	modals: {},
};

export { dict };
