import "./Balance.scss";

import { useInfiniteQuery } from "@tanstack/solid-query";
import LottiePlayer from "lottix/solid/LottiePlayer";
import { TbOutlineWallet } from "solid-icons/tb";
import { type Component, createMemo, createSignal, Show } from "solid-js";
import { apiTransactionsSelf } from "../api";
import { SVGSymbol } from "../components/SVG";
import BackButton from "../components/tma/BackButton";
import Clickable from "../components/ui/Clickable";
import CustomMainButton from "../components/ui/CustomMainButton";
import Scrollable from "../components/ui/Scrollable";
import Section, { SectionList } from "../components/ui/Section";
import { useTranslation } from "../contexts/TranslationContext";
import useQueryFeedback from "../hooks/useQueryFeedback";
import Page from "../layouts/Page";
import { LottieAnimations } from "../utils/animations";
import { navigator } from "../utils/navigator";
import { popupManager } from "../utils/popup";
import { store } from "../utils/store";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const PageBalance: Component = () => {
	const { t, td } = useTranslation();

	const [wallet, _setWallet] = createSignal("");

	const onBackButton = () => {
		if (navigator.isBackable()) {
			navigator.back();
		} else {
			navigator.go("/");
		}
	};

	const SectionWallet = () => {
		const onClickConnect = () => {
			invokeHapticFeedbackImpact("soft");
		};

		const onClickDisconnect = () => {
			invokeHapticFeedbackImpact("soft");
		};

		return (
			<Show
				when={wallet()}
				fallback={
					<div class="section-wallet wallet-connect">
						<TbOutlineWallet />

						<div>
							<span>{t("pages.balance.wallet.connect.title")}</span>
						</div>

						<Clickable onClick={onClickConnect}>
							{t("pages.balance.wallet.connect.button")}
						</Clickable>
					</div>
				}
			>
				<div class="section-wallet wallet-connected">
					<TbOutlineWallet />

					<div>
						<span>{t("pages.balance.wallet.connected.title")}</span>

						<span>ADDRESS</span>
					</div>

					<Clickable onClick={onClickDisconnect}>
						{t("pages.balance.wallet.connected.button")}
					</Clickable>
				</div>
			</Show>
		);
	};

	const SectionBalance = () => {
		return (
			<Section
				class="section-balance"
				description={t("pages.balance.balance.description")}
			>
				<span>{t("pages.balance.balance.total")}</span>

				<div>
					<span>{store.balance?.total?.toLocaleString()}</span>

					<SVGSymbol id="TON" />
				</div>

				<div>
					<span>
						{td("pages.balance.balance.pending", {
							amount: store.balance?.pending,
						})}
					</span>
				</div>
			</Section>
		);
	};

	const SectionTransactions = () => {
		const query = useInfiniteQuery(() => ({
			queryKey: ["transactions"],
			queryFn: (data) => apiTransactionsSelf(data.pageParam),
			initialPageParam: 0,
			getNextPageParam: (lastData) => {
				if (lastData.transactions.length === 0) return undefined;
				return lastData.nextOffset;
			},
		}));

		useQueryFeedback({
			query,
			options: {
				hapticOnError: true,
				hapticOnSuccess: true,
				toastOnError: true,
				refetchKey: "transactions",
			},
		});

		const transactions = createMemo(
			() => query.data?.pages.flatMap((page) => page.transactions) ?? [],
		);

		return (
			<Show when={transactions().length > 0}>
				<SectionList
					class="section-transactions"
					title={t("pages.balance.transactions.title")}
					items={transactions().map((transaction) => ({
						prepend: () => <SVGSymbol id="TON" />,
						placeholder: () => (
							<span
								class="pe-4!"
								classList={{
									"text-success": (transaction.amount ?? 0) >= 0,
									"text-danger": (transaction.amount ?? 0) < 0,
								}}
							>
								<SVGSymbol
									id={
										(transaction.amount ?? 0) >= 0 ? "OcDownload2" : "OcUpload2"
									}
								/>
							</span>
						),
						label: `${(transaction.amount ?? "").toLocaleString()} TON`,
					}))}
				/>
			</Show>
		);
	};

	const SectionFooter = () => {
		const onClick = () => {
			popupManager.openPopup({
				title: t("pages.balance.soon.title"),
				message: t("pages.balance.soon.description"),
				buttons: [
					{
						id: "ok",
						type: "default",
						text: t("pages.balance.soon.buttons.ok"),
					},
					{
						id: "ohok",
						type: "default",
						text: t("pages.balance.soon.buttons.ohok"),
					},
					{
						id: "okok",
						type: "default",
						text: t("pages.balance.soon.buttons.okok"),
					},
				],
			});
		};

		return (
			<>
				<CustomMainButton
					text={t("pages.balance.deposit.button")}
					onClick={() => {
						invokeHapticFeedbackImpact("soft");

						onClick();
					}}
				/>
				<CustomMainButton
					secondary
					text={t("pages.balance.withdraw.button")}
					onClick={() => {
						invokeHapticFeedbackImpact("soft");

						onClick();
					}}
				/>
			</>
		);
	};

	return (
		<>
			<Page
				id="container-page-balance"
				title={t("pages.balance.title")}
				footer={SectionFooter}
			>
				<Scrollable>
					<LottiePlayer
						src={LottieAnimations.duck.money.url}
						outline={LottieAnimations.duck.money.outline}
						autoplay
						loop
					/>

					<SectionWallet />

					<SectionBalance />

					<SectionTransactions />
				</Scrollable>
			</Page>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageBalance;
