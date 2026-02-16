const dict = {
	locales: {
		en: "English",
		fa: "فارسی",
		ar: "العربية",
		de: "Deutsch",
		ru: "Русский",
		hi: "हिन्दी",
	},
	general: {
		appName: "Not Boost",
		members: "{count} members",
		subscribers: "{count} subscribers",
	},
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
		advertisers: {
			title: "Advertisers",
			tabs: {
				all: "All",
				ready: "Ready",
				pending: "Pending",
				disabled: "Disabled",
			},
			items: {
				empty: {
					title: "No campaigns yet",
					subtitle: "Nothing to see here",
					description: "Let’s create your first campaign.",
					button: "Create Campaign",
					search: {
						title: "Nothing found",
						description: "No campaigns matched {query}.",
					},
				},
			},
		},
		publishers: {
			title: "Publishers",
			tabs: {
				all: "All",
				active: "Active",
				inactive: "Inactive",
				verified: "Verified",
			},
			items: {
				empty: {
					title: "Nothing here yet",
					subtitle: "Nothing to see here",
					description: "Let’s add your channel/supergroup.",
					button: "Start Monetizing",
					search: {
						title: "Not Found",
						description: "No results found for {query}.",
					},
				},
			},
		},
		entity: {
			tabs: {
				overview: {
					title: "Overview",
				},
				statistics: {
					title: "Statistics",
				},
			},
			overview: {
				title: {
					channel: "Channel Overview",
					group: "Group Overview",
				},
				range: "{from} - {to}",
				channel: {
					followers: {
						label: "Followers",
					},
					viewsPerPost: {
						label: "Views Per Post",
					},
					reactionsPerPost: {
						label: "Reactions Per Post",
					},
					sharesPerPost: {
						label: "Shares Per Post",
					},
					viewsPerStory: {
						label: "Views Per Story",
					},
					sharesPerStory: {
						label: "Shares Per Story",
					},
					enabledNotifications: {
						label: "Enabled Notifications",
					},
					premiumAudience: {
						label: "Premium Subscribers",
					},
				},
				group: {
					members: {
						label: "Members",
					},
					messages: {
						label: "Messages",
					},
					viewingMembers: {
						label: "Viewing Members",
					},
					postingMembers: {
						label: "Posting Members",
					},
					premiumAudience: {
						label: "Premium Members",
					},
				},
				empty: {
					text: "Statistics not available.",
				},
			},
			infolist: {
				language: {
					label: "Language",
					undefined: "Not Set",
				},
				category: {
					label: "Category",
					undefined: "Not Set",
				},
				status: {
					label: "Status",
					status: {
						active: "Active",
						inactive: "Inactive",
					},
				},
				verification: {
					label: "Verification",
					status: {
						verified: "Verified",
						unverified: "Unverified",
					},
				},
			},
			options: {
				title: {
					channel: "Channel Options",
					supergroup: "Group Options",
				},
				section: {
					category: {
						label: "Category",
						picker: "Select Category",
						undefined: "Not Set",
					},
					language: {
						label: "Language",
						picker: "Select Language",
						undefined: "Not Set",
					},
					status: {
						label: "Status",
					},
					verification: {
						label: "Verification",
						verified: "Verified",
						apply: "Request Verification",
					},
				},
			},
			statistics: {
				charts: {
					channel: {
						growth: {
							title: "Growth",
						},
						followers: {
							title: "Followers",
						},
						notifications: {
							title: "Notifications",
						},
						viewsByHours: {
							title: "Views By Hours (UTC)",
						},
						viewsBySource: {
							title: "Views By Source",
						},
						followersBySource: {
							title: "Followers By Source",
						},
						languages: {
							title: "Languages",
						},
						interactions: {
							title: "Interactions",
						},
						reactionsByEmotion: {
							title: "Reactions By Emotion",
						},
					},
					group: {
						growth: {
							title: "Growth",
						},
						members: {
							title: "Group Members",
						},
						newMembersBySource: {
							title: "New Members By Source",
						},
						membersPrimaryLanguage: {
							title: "Members Primary Language",
						},
						messages: {
							title: "Messages",
						},
						actions: {
							title: "Actions",
						},
						topHours: {
							title: "Top Hours",
						},
						topDaysOfWeek: {
							title: "Top Days Of Week",
						},
					},
				},
			},
			ads: {
				types: {
					"channel-post": {
						title: "Channel Post",
						description:
							"The ad is published in the channel and remains visible for the selected period.",
					},
					"channel-story": {
						title: "Channel Story",
						description:
							"The ad appears as a channel story and remains active for the selected period.",
					},
					"group-pin": {
						title: "Pinned Group Post",
						description:
							"The ad is posted in the group and pinned to the top for the selected period.",
					},
				},
				options: {
					active: {
						label: "Enabled",
					},
					maxPeriod: {
						label: "Maximum Period",
					},
					unit: {
						label: "Minimum Unit",
					},
					price: {
						label: "Price Per Hour",
						placeholder: "1 TON",
					},
				},
				inactive: {
					text: "Available after setup.",
				},
				unavailable: {
					title: "Ads Unavailable",
					description: "The ads are currently not available.",
				},
			},
			footer: {
				view: {
					channel: {
						text: "View Channel",
					},
					supergroup: {
						text: "View Group",
					},
				},
				share: {
					text: "📣 Let's see {name} on {app_name} ads marketplace!",
				},
				offer: {
					text: "Create Offer",
				},
			},
			order: {
				hours: "{amount} Hours /",
			},
		},
		campaign: {
			hint: {
				text: "You can disable the campaign to stop receiving offers.",
			},
			footer: {
				button: {
					set: "Set Banner",
					share: "Share",
					disable: "Disable",
					enable: "Enable",
					offer: "Create Offer",
				},
				text: {
					disabled: "Campaign is not active.",
				},
				set: {
					title: "Campaign Banner",
					message:
						"After closing the app, continue in the bot to add your banner.",
				},
				share: {
					text: "📣 Let's see {name} on {app_name} ads marketplace!",
				},
			},
			viewer: {
				description: {
					empty: "No description.",
				},
			},
		},
		void: {
			title: "Void",
			subtitle: "This page is Void",
			description:
				"We don’t have enough content to fill this page yet—it’s still an MVP. For now, enjoy these random algorithmically generated pixel artworks <3",
		},
		balance: {
			title: "Balance",
			wallet: {
				connected: {
					title: "Wallet Connected",
					button: "Disconnect",
				},
				connect: {
					title: "Connect Your Wallet",
					button: "Connect",
				},
			},
			balance: {
				total: "Total Balance",
				pending: "Pending Balance: {amount}",
				description: "You can't withdraw pending balance.",
			},
			deposit: {
				button: "Deposit",
			},
			withdraw: {
				button: "Withdraw",
			},
			transactions: {
				title: "Transactions History",
			},
			soon: {
				title: "Coming Soon",
				description:
					"We currently work with internal balance system for testing purposes, not because I suck at blockchain or anything, we can copy-paste the Contest bot's payment system in the production when go live.",
				buttons: {
					ok: "Well, Ok",
					ohok: "Oh, Ok",
					okok: "Ok OK!",
				},
			},
		},
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
		telegramChart: {
			all: "All",
			zoomOut: "Zoom Out",
		},
		datepicker: {
			notSet: "Not Set",
		},
	},
	modals: {
		publishersAdd: {
			title: {
				channel: "Monetize Your Channel",
				group: "Monetize Your Supergroup",
			},
			description:
				"Add the bot as an admin to your chat and grant the following permissions:",
			permissions: {
				post: {
					title: "Post Messages",
					description: "Allows automated launch of ads.",
				},
				edit: {
					title: "Edit Messages",
					description: "Used to edit ads if needed.",
				},
				delete: {
					title: "Delete Messages",
					description: "Used to remove ads when necessary.",
				},
				promote: {
					title: "Add New Admins",
					description: "Required to add the analytics bot.",
				},
				pin: {
					title: "Pin Messages",
					description: "Required to pin ads.",
				},
				restrict: {
					title: "Restrict Members",
					description: "Required to access group analytics.",
				},
			},
			toggle: {
				channel: "Monetize a Supergroup instead?",
				group: "Monetize a Channel instead?",
			},
			button: {
				channel: "Connect a Channel",
				group: "Connect a Supergroup",
			},
		},
		campaignsAdd: {
			title: {
				text: "Create a Campaign",
			},
			button: {
				text: "Create Campaign",
			},
			section: {
				fields: {
					name: {
						placeholder: "Campaign Name",
					},
					description: {
						placeholder: "Campaign Description",
					},
				},
				description:
					"You’ll be redirected to the bot to upload your campaign banner.",
			},
			success: {
				title: "✅ Campaign Created",
				message:
					"Your campaign is created. After closing the app, continue in the bot to add your banner.",
			},
		},
		campaignsOffer: {
			title: "Send Offer to Campaign",
			description:
				"Select an active channel or group to express interest in this campaign and notify the campaign owner.",
			entity: {
				label: "Channel / Supergroup",
				undefined: "Not Selected",
			},
			hint: "You have {count} eligible chats.",
			button: {
				send: "Send Offer",
			},
			success: {
				title: "✅ Offer Sent",
				message: "Your offer has been sent successfully.",
			},
		},
		entitiesOffer: {
			campaign: {
				label: "Campaign",
				undefined: "Not Selected",
			},
			start: {
				label: "Start Date",
			},
			duration: {
				label: "Duration",
				hours: "{hours} Hours",
			},
			price: {
				label: "Price",
			},
			hint: "You have {count} eligible campaigns.",
			button: {
				send: "Send Offer",
			},
			success: {
				title: "✅ Offer Sent",
				message:
					"Your offer has been sent successfully. You can chat with the owner using the bot.",
			},
			unsupported: {
				title: "Not Supported Currently",
				message:
					"This ad type is not supported for offers. Maksim didn't extend the deadline enough. Try channel posts for now.",
			},
			insufficientBalance: {
				title: "Insufficient Balance",
				message:
					"You do not have enough balance to send this offer. Please top up your balance and try again.",
			},
		},
		verification: {
			title: "Request Verification",
			description:
				"You can request our support team to verify your chat or campaign. Verified entities will be listed on the homepage.",
			button: {
				support: "Contact Support",
			},
		},
		settings: {
			title: "Settings",
			language: "Language",
			haptic: "Haptic Feedback",
			click: "Click Me!",
			footer: "$BUILD by Contest for Contest",
		},
	},
};

export { dict };
