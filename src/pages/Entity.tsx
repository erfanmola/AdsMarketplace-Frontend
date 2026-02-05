import { useQuery } from "@tanstack/solid-query";
import BackButton from "../components/tma/BackButton";
import Page from "../layouts/Page";
import { navigator } from "../utils/navigator";
import "./Entity.scss";

import { useParams } from "@solidjs/router";
import { type Component, Suspense } from "solid-js";

import { apiEntity } from "../api";
import Shimmer from "../components/ui/Shimmer";
import useQueryFeedback from "../hooks/useQueryFeedback";

const PageEntity: Component = () => {
	const params = useParams();
	const query = useQuery(() => ({
		queryKey: ["entity", params.id],
		queryFn: (data) => apiEntity(data.queryKey[1]!),
	}));

	useQueryFeedback({
		query,
		options: {
			hapticOnError: true,
			hapticOnSuccess: true,
			toastOnError: true,
			refetchKey: "entity",
		},
	});

	const onBackButton = () => {
		if (navigator.history.length > 2) {
			navigator.backForce();
		} else {
			navigator.go("/");
		}
	};

	const Entity: Component<{ entity: any }> = (props) => {
		return <div>{JSON.stringify(props.entity)}</div>;
	};

	const EntityShimmer: Component = () => {
		return <Shimmer id="shimmer-entity">Loading...</Shimmer>;
	};

	return (
		<>
			<Page id="container-page-entity">
				<Suspense fallback={<EntityShimmer />}>
					<Entity entity={query.data?.entity} />
				</Suspense>
			</Page>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageEntity;
