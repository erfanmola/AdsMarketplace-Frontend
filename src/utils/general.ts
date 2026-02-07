export const getNameInitials = (name: string) => {
	const parts = name.trim().split(/\s+/);

	const pick = (word: string) => {
		for (const ch of Array.from(word)) {
			if (/\p{L}|\p{N}|\p{Emoji}/u.test(ch)) return ch;
		}
		return null;
	};

	const letters = parts.map(pick).filter(Boolean) as string[];

	if (letters.length === 0) return "";
	if (letters.length === 1) return letters[0];

	return letters[0] + letters[letters.length - 1];
};

export const oneOfOr = <T>(item: T, items: T[], fallback: T) => {
	if (items.includes(item)) {
		return item;
	}

	return fallback;
};
