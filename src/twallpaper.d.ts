declare module "twallpaper" {
	export interface Position {
		x: number;
		y: number;
	}

	export interface RgbColor {
		r: number;
		g: number;
		b: number;
	}

	export interface PatternOptions {
		image?: string;
		mask?: boolean;
		background?: string;
		blur?: number;
		size?: string;
		opacity?: number;
	}

	export interface TWallpaperOptions {
		colors: string[];
		fps?: number;
		tails?: number;
		animate?: boolean;
		scrollAnimate?: boolean;
		pattern?: PatternOptions;
	}

	export interface Rgb {
		r: number;
		g: number;
		b: number;
	}

	export default class TWallpaper {
		constructor(container?: HTMLElement, options?: TWallpaperOptions);

		init(options?: TWallpaperOptions, container?: HTMLElement): void;
		dispose(): void;
		updateTails(tails?: number): void;
		updateFrametime(fps?: number): void;
		updatePattern(pattern: PatternOptions): void;
		updateColors(hexCodes: string[]): void;
		toNextPosition(callback?: () => void): void;
		animate(start?: boolean): void;
		scrollAnimate(start?: boolean): void;
	}
}
