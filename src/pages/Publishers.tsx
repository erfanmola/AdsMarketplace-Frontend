import { SVGSymbol } from "../components/SVG";
import { useTranslation } from "../contexts/TranslationContext";
import Page, { PageHeaderIconList } from "../layouts/Page";
import { setModals } from "../utils/modal";
import "./Publishers.scss";

import type { Component } from "solid-js";

const PagePublishers: Component = () => {
	const { t } = useTranslation();

	const HeaderAppend = () => {
		return (
			<PageHeaderIconList
				items={[
					{
						component: () => <SVGSymbol id="FaSolidPlus" />,
						onClick: () => {
							setModals("publishersAdd", "open", true);
						},
					},
				]}
			/>
		);
	};

	return (
		<Page
			id="container-page-publishers"
			title={t("pages.publishers.title")}
			headerAppend={HeaderAppend}
		>
			Publishers Content
		</Page>
	);
};

export default PagePublishers;
