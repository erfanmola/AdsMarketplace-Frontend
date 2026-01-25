import { retrieveRawInitData } from "@telegram-apps/sdk-solid";
import { requestAPI } from "../utils/api";
import { urlParseQueryString } from "../utils/auth";

export const apiAuthUser = async () =>
	requestAPI(
		"/auth",
		{
			initDataUnsafe: JSON.stringify(
				urlParseQueryString(retrieveRawInitData() ?? ""),
			),
		},
		"POST",
	);
