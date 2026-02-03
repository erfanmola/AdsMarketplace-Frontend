export const clamp = (value: number, min: number, max: number): number =>
	Math.min(Math.max(value, min), max);

export const getRandomIntInclusive = (min: number, max: number): number => {
	const lower = Math.ceil(min);
	const upper = Math.floor(max);
	return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

export const randomLong = () => {
	const min = Number.MIN_SAFE_INTEGER;
	const max = Number.MAX_SAFE_INTEGER;
	return Math.abs(Math.floor(Math.random() * (max - min + 1)) + min);
};

export const formatTGCount = (input: number | string): string => {
	const num = Number(input);
	if (!Number.isFinite(num)) return "0";

	const abs = Math.abs(num);
	const sign = num < 0 ? "-" : "";

	const format = (value: number, suffix: string) => {
		const intPart = Math.floor(value);

		let display: number;

		if (intPart >= 100) {
			// 3 digits → no decimals
			display = Math.floor(value);
		} else if (intPart >= 10) {
			// 2 digits → 1 decimal
			display = Math.floor(value * 10) / 10;
		} else {
			// 1 digit → 2 decimals
			display = Math.floor(value * 100) / 100;
		}

		return sign + display.toString().replace(/\.0+$/, "") + suffix;
	};

	if (abs < 1_000) return sign + abs.toString();
	if (abs < 1_000_000) return format(abs / 1_000, "K");
	if (abs < 1_000_000_000) return format(abs / 1_000_000, "M");
	if (abs < 1_000_000_000_000) return format(abs / 1_000_000_000, "B");

	return format(abs / 1_000_000_000_000, "T");
};
