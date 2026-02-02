import type {
	UseInfiniteQueryResult,
	UseQueryResult,
} from "@tanstack/solid-query";
import { BiSolidErrorCircle } from "solid-icons/bi";
import { createEffect, on } from "solid-js";
import { toast } from "../components/ui/Toast";
import { APIError } from "../utils/api";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
} from "../utils/telegram";

type QueryFeedbackProps = {
	query: UseInfiniteQueryResult | UseQueryResult;
	options?: {
		hapticOnError?: boolean;
		toastOnError?: boolean;
		hapticOnSuccess?: boolean;
	};
};

const useQueryFeedback = (props: QueryFeedbackProps) => {
	createEffect(
		on(
			() => props.query.dataUpdatedAt,
			(t) => {
				if (props.options?.hapticOnSuccess) {
					if (t) invokeHapticFeedbackImpact("soft");
				}
			},
			{ defer: true },
		),
	);

	createEffect(
		on(
			() => props.query.error,
			() => {
				if (props.query.error instanceof APIError) {
					if (props.options?.hapticOnError) {
						invokeHapticFeedbackNotification("error");
					}

					if (props.options?.toastOnError) {
						toast({
							text: props.query.error.message,
							icon: BiSolidErrorCircle,
						});
					}
				}
			},
		),
	);
};

export default useQueryFeedback;
