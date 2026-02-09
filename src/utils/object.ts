export const objectToStringRecord = (obj: Record<string | number, any>) => {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [
			key,
			typeof value === "string" ? value : JSON.stringify(value),
		]),
	);
};
