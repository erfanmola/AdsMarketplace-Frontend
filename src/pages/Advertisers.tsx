import { SVGSymbol } from "../components/SVG";
import { useTranslation } from "../contexts/TranslationContext";
import Page, { PageHeaderIconList } from "../layouts/Page";
import { setModals } from "../utils/modal";
import "./Advertisers.scss";

import type { Component } from "solid-js";

const PageAdvertisers: Component = () => {
	const { t } = useTranslation();

	const onClickAdd = () => {
		setModals("campaignsAdd", "open", true);
	};

	const HeaderAppend = () => {
		return (
			<PageHeaderIconList
				items={[
					{
						component: () => <SVGSymbol id="FaSolidPlus" />,
						onClick: onClickAdd,
					},
				]}
			/>
		);
	};

	return (
		<Page
			id="container-page-advertisers"
			title={t("pages.advertisers.title")}
			headerAppend={HeaderAppend}
		>
			Advertisers Content
		</Page>
	);
};

export default PageAdvertisers;
