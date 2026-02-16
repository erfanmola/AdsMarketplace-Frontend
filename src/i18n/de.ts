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
		members: "{count} Mitglieder",
		subscribers: "{count} Abonnenten",
	},
	pages: {
		error: {
			title: "Fehler",
			description: "Ein Fehler ist aufgetreten.",
			data: {
				error: {
					title: "Etwas ist schiefgelaufen",
					description:
						"Wir konnten die Daten nicht laden, versuche die App neu zu laden.",
				},
			},
		},
		errorInvalidEnv: {
			title: "Ungültige Umgebung",
			description:
				"Diese App ist für die Ausführung in der Telegram Mini Apps-Umgebung konzipiert.",
		},
		intro: {
			sections: {
				intro: {
					title: "Not Boost",
					description:
						"Ein fairer, sicherer und automatisierter Werbemarktplatz für Telegram. Deine Werbung, deine Regeln.",
				},
				advertisers: {
					title: "Werbetreibende",
					description:
						"Starte Kampagnen mit Vertrauen. Treuhand stellt sicher, dass deine Zahlungen sicher sind, bis die Ergebnisse geliefert werden.",
				},
				publishers: {
					title: "Publisher",
					description:
						"Erhalte sichere und pünktliche Zahlungen. Unser automatisierter Ablauf garantiert Transparenz und Fairness für jede Anzeige.",
				},
				flow: {
					title: "Transparenz",
					description:
						"Jeder Schritt wird verfolgt. Treuhandgeschützte Zahlungen. Automatisierte Prozesse, die für beide Seiten funktionieren.",
				},
				done: {
					title: "Bereit?",
					description:
						"Beginne mit voller Zuversicht und ohne Aufwand zu werben oder deinen Kanal zu monetarisieren.",
				},
			},
			button: {
				start: "Loslegen",
			},
		},
		home: {},
		advertisers: {
			title: "Werbetreibende",
			tabs: {
				all: "Alle",
				ready: "Bereit",
				pending: "Ausstehend",
				disabled: "Deaktiviert",
			},
			items: {
				empty: {
					title: "Noch keine Kampagnen",
					subtitle: "Hier gibt's nichts zu sehen",
					description: "Erstellen wir deine erste Kampagne.",
					button: "Kampagne erstellen",
					search: {
						title: "Nichts gefunden",
						description: "Keine Kampagnen gefunden für {query}.",
					},
				},
			},
		},
		publishers: {
			title: "Publisher",
			tabs: {
				all: "Alle",
				active: "Aktiv",
				inactive: "Inaktiv",
				verified: "Verifiziert",
			},
			items: {
				empty: {
					title: "Noch nichts hier",
					subtitle: "Hier gibt's nichts zu sehen",
					description: "Füge deinen Kanal/deine Supergruppe hinzu.",
					button: "Monetarisierung starten",
					search: {
						title: "Nicht gefunden",
						description: "Keine Ergebnisse gefunden für {query}.",
					},
				},
			},
		},
		entity: {
			tabs: {
				overview: {
					title: "Übersicht",
				},
				statistics: {
					title: "Statistiken",
				},
			},
			overview: {
				title: {
					channel: "Kanalstatistiken",
					group: "Gruppenstatistiken",
				},
				range: "{from} - {to}",
				channel: {
					followers: {
						label: "Follower",
					},
					viewsPerPost: {
						label: "Aufrufe pro Beitrag",
					},
					reactionsPerPost: {
						label: "Reaktionen pro Beitrag",
					},
					sharesPerPost: {
						label: "Teilungen pro Beitrag",
					},
					viewsPerStory: {
						label: "Aufrufe pro Story",
					},
					sharesPerStory: {
						label: "Teilungen pro Story",
					},
					enabledNotifications: {
						label: "Benachrichtigungen aktiviert",
					},
					premiumAudience: {
						label: "Premium-Abonnenten",
					},
				},
				group: {
					members: {
						label: "Mitglieder",
					},
					messages: {
						label: "Nachrichten",
					},
					viewingMembers: {
						label: "Zuschauende Mitglieder",
					},
					postingMembers: {
						label: "Beitragende Mitglieder",
					},
					premiumAudience: {
						label: "Premium-Mitglieder",
					},
				},
				empty: {
					text: "Statistiken nicht verfügbar.",
				},
			},
			infolist: {
				language: {
					label: "Sprache",
					undefined: "Nicht festgelegt",
				},
				category: {
					label: "Kategorie",
					undefined: "Nicht festgelegt",
				},
				status: {
					label: "Status",
					status: {
						active: "Aktiv",
						inactive: "Inaktiv",
					},
				},
				verification: {
					label: "Verifizierung",
					status: {
						verified: "Verifiziert",
						unverified: "Nicht verifiziert",
					},
				},
			},
			options: {
				title: {
					channel: "Kanaloptionen",
					supergroup: "Gruppenoptionen",
				},
				section: {
					category: {
						label: "Kategorie",
						picker: "Kategorie auswählen",
						undefined: "Nicht festgelegt",
					},
					language: {
						label: "Sprache",
						picker: "Sprache auswählen",
						undefined: "Nicht festgelegt",
					},
					status: {
						label: "Status",
					},
					verification: {
						label: "Verifizierung",
						verified: "Verifiziert",
						apply: "Verifizierung beantragen",
					},
				},
			},
			statistics: {
				charts: {
					channel: {
						growth: {
							title: "Wachstum",
						},
						followers: {
							title: "Follower",
						},
						notifications: {
							title: "Benachrichtigungen",
						},
						viewsByHours: {
							title: "Aufrufe nach Stunden (UTC)",
						},
						viewsBySource: {
							title: "Aufrufe nach Quelle",
						},
						followersBySource: {
							title: "Follower nach Quelle",
						},
						languages: {
							title: "Sprachen",
						},
						interactions: {
							title: "Interaktionen",
						},
						reactionsByEmotion: {
							title: "Reaktionen nach Emotion",
						},
					},
					group: {
						growth: {
							title: "Wachstum",
						},
						members: {
							title: "Gruppenmitglieder",
						},
						newMembersBySource: {
							title: "Neue Mitglieder nach Quelle",
						},
						membersPrimaryLanguage: {
							title: "Hauptsprache der Mitglieder",
						},
						messages: {
							title: "Nachrichten",
						},
						actions: {
							title: "Aktionen",
						},
						topHours: {
							title: "Top-Stunden",
						},
						topDaysOfWeek: {
							title: "Top-Wochentage",
						},
					},
				},
			},
			ads: {
				types: {
					"channel-post": {
						title: "Kanalbeitrag",
						description:
							"Die Anzeige wird im Kanal veröffentlicht und bleibt für den ausgewählten Zeitraum sichtbar.",
					},
					"channel-story": {
						title: "Kanal-Story",
						description:
							"Die Anzeige erscheint als Kanal-Story und bleibt für den ausgewählten Zeitraum aktiv.",
					},
					"group-pin": {
						title: "Angehefteter Gruppenbeitrag",
						description:
							"Die Anzeige wird in der Gruppe veröffentlicht und für den ausgewählten Zeitraum oben angeheftet.",
					},
				},
				options: {
					active: {
						label: "Aktiviert",
					},
					maxPeriod: {
						label: "Maximaler Zeitraum",
					},
					unit: {
						label: "Mindesteinheit",
					},
					price: {
						label: "Preis pro Stunde",
						placeholder: "1 TON",
					},
				},
				inactive: {
					text: "Verfügbar nach Einrichtung.",
				},
				unavailable: {
					title: "Anzeigen nicht verfügbar",
					description: "Die Anzeigen sind derzeit nicht verfügbar.",
				},
			},
			footer: {
				view: {
					channel: {
						text: "Kanal ansehen",
					},
					supergroup: {
						text: "Gruppe ansehen",
					},
				},
				share: {
					text: "📣 Sieh dir {name} auf dem {app_name} Werbemarktplatz an!",
				},
				offer: {
					text: "Angebot erstellen",
				},
			},
			order: {
				hours: "{amount} Stunden /",
			},
		},
		campaign: {
			hint: {
				text: "Du kannst die Kampagne deaktivieren, um keine Angebote mehr zu erhalten.",
			},
			footer: {
				button: {
					set: "Banner festlegen",
					share: "Teilen",
					disable: "Deaktivieren",
					enable: "Aktivieren",
					offer: "Angebot erstellen",
				},
				text: {
					disabled: "Kampagne ist nicht aktiv.",
				},
				set: {
					title: "Kampagnenbanner",
					message:
						"Nach dem Schließen der App, fahre im Bot fort, um dein Banner hinzuzufügen.",
				},
				share: {
					text: "📣 Sieh dir {name} auf dem {app_name} Werbemarktplatz an!",
				},
			},
			viewer: {
				description: {
					empty: "Keine Beschreibung.",
				},
			},
		},
		void: {
			title: "Leere",
			subtitle: "Diese Seite ist leer",
			description:
				"Wir haben noch nicht genug Inhalt, um diese Seite zu füllen – es ist immer noch ein MVP. Genieße vorerst diese zufällig algorithmisch generierten Pixel-Kunstwerke <3",
		},
		balance: {
			title: "Guthaben",
			wallet: {
				connected: {
					title: "Wallet verbunden",
					button: "Trennen",
				},
				connect: {
					title: "Wallet verbinden",
					button: "Verbinden",
				},
			},
			balance: {
				total: "Gesamtguthaben",
				pending: "Ausstehendes Guthaben: {amount}",
				description: "Du kannst ausstehendes Guthaben nicht abheben.",
			},
			deposit: {
				button: "Einzahlen",
			},
			withdraw: {
				button: "Abheben",
			},
			transactions: {
				title: "Transaktionsverlauf",
			},
			soon: {
				title: "Demnächst verfügbar",
				description:
					"Wir arbeiten derzeit mit einem internen Guthabensystem zu Testzwecken, nicht weil ich keine Blockchain kann oder so, wir können das Zahlungssystem des Contest-Bots für den Produktivbetrieb kopieren/einfügen.",
				buttons: {
					ok: "Na gut",
					ohok: "Ach so",
					okok: "OK OK!",
				},
			},
		},
	},
	components: {
		bottomBar: {
			items: {
				home: {
					title: "Start",
				},
				advertisers: {
					title: "Werbetreibende",
				},
				publishers: {
					title: "Publisher",
				},
				profile: {
					title: "Profil",
				},
			},
			search: {
				title: "Suche",
			},
		},
		telegramChart: {
			all: "Alle",
			zoomOut: "Verkleinern",
		},
		datepicker: {
			notSet: "Nicht festgelegt",
		},
	},
	modals: {
		publishersAdd: {
			title: {
				channel: "Monetarisiere deinen Kanal",
				group: "Monetarisiere deine Supergruppe",
			},
			description:
				"Füge den Bot als Administrator zu deinem Chat hinzu und gewähre folgende Berechtigungen:",
			permissions: {
				post: {
					title: "Nachrichten senden",
					description: "Ermöglicht automatisches Veröffentlichen von Anzeigen.",
				},
				edit: {
					title: "Nachrichten bearbeiten",
					description: "Wird verwendet, um Anzeigen bei Bedarf zu bearbeiten.",
				},
				delete: {
					title: "Nachrichten löschen",
					description: "Wird verwendet, um Anzeigen bei Bedarf zu entfernen.",
				},
				promote: {
					title: "Neue Administratoren hinzufügen",
					description: "Erforderlich, um den Analyse-Bot hinzuzufügen.",
				},
				pin: {
					title: "Nachrichten anheften",
					description: "Erforderlich, um Anzeigen anzuheften.",
				},
				restrict: {
					title: "Mitglieder einschränken",
					description: "Erforderlich für den Zugriff auf Gruppenanalysen.",
				},
			},
			toggle: {
				channel: "Stattdessen eine Supergruppe monetarisieren?",
				group: "Stattdessen einen Kanal monetarisieren?",
			},
			button: {
				channel: "Kanal verbinden",
				group: "Supergruppe verbinden",
			},
		},
		campaignsAdd: {
			title: {
				text: "Kampagne erstellen",
			},
			button: {
				text: "Kampagne erstellen",
			},
			section: {
				fields: {
					name: {
						placeholder: "Kampagnenname",
					},
					description: {
						placeholder: "Kampagnenbeschreibung",
					},
				},
				description:
					"Du wirst zum Bot weitergeleitet, um dein Kampagnenbanner hochzuladen.",
			},
			success: {
				title: "✅ Kampagne erstellt",
				message:
					"Deine Kampagne wurde erstellt. Nach dem Schließen der App, fahre im Bot fort, um dein Banner hinzuzufügen.",
			},
		},
		campaignsOffer: {
			title: "Angebot an Kampagne senden",
			description:
				"Wähle einen aktiven Kanal oder eine Gruppe aus, um Interesse an dieser Kampagne zu bekunden und den Kampagnenbesitzer zu benachrichtigen.",
			entity: {
				label: "Kanal / Supergruppe",
				undefined: "Nicht ausgewählt",
			},
			hint: "Du hast {count} geeignete Chats.",
			button: {
				send: "Angebot senden",
			},
			success: {
				title: "✅ Angebot gesendet",
				message: "Dein Angebot wurde erfolgreich gesendet.",
			},
		},
		entitiesOffer: {
			campaign: {
				label: "Kampagne",
				undefined: "Nicht ausgewählt",
			},
			start: {
				label: "Startdatum",
			},
			duration: {
				label: "Dauer",
				hours: "{hours} Stunden",
			},
			price: {
				label: "Preis",
			},
			hint: "Du hast {count} geeignete Kampagnen.",
			button: {
				send: "Angebot senden",
			},
			success: {
				title: "✅ Angebot gesendet",
				message:
					"Dein Angebot wurde erfolgreich gesendet. Du kannst mit dem Besitzer über den Bot chatten.",
			},
			unsupported: {
				title: "Derzeit nicht unterstützt",
				message:
					"Dieser Anzeigentyp wird für Angebote nicht unterstützt. Maksim hat die Frist nicht genug verlängert. Versuche es vorerst mit Kanalbeiträgen.",
			},
			insufficientBalance: {
				title: "Nicht genügend Guthaben",
				message:
					"Du hast nicht genügend Guthaben, um dieses Angebot zu senden. Bitte lade dein Guthaben auf und versuche es erneut.",
			},
		},
		verification: {
			title: "Verifizierung beantragen",
			description:
				"Du kannst unser Support-Team bitten, deinen Chat oder deine Kampagne zu verifizieren. Verifizierte Einträge werden auf der Startseite gelistet.",
			button: {
				support: "Support kontaktieren",
			},
		},
		settings: {
			title: "Einstellungen",
			language: "Sprache",
			haptic: "Haptisches Feedback",
			reset: "App-Daten zurücksetzen",
			click: "Klick mich!",
			footer: "$BUILD by Contest for Contest",
		},
	},
};

export { dict };
