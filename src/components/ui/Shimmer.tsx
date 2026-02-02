import type { ParentComponent } from "solid-js";
import "./Shimmer.scss";

type ShimmerProps = {
	id: string;
	tint?: boolean;
};

const Shimmer: ParentComponent<ShimmerProps> = (props) => {
	return (
		<div
			class="container-shimmer"
			classList={{ "shimmer-tint": props.tint }}
			id={props.id}
		>
			{props.children}
		</div>
	);
};

export default Shimmer;
