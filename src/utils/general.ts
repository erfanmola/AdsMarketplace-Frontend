export const getNameInitials = (name: string) => {
	const parts = name
		.trim()
		.split(/\s+/)
		.map((part) => Array.from(part)[0]);

	if (parts.length === 0) {
		return "";
	}

	return parts.length === 1
		? parts[0]
		: `${parts[0]}${parts[parts.length - 1]}`;
};
