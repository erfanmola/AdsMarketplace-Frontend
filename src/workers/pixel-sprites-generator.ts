declare const self: Worker;

export type IWorkerPixelSpritesGeneratorMessage =
	IWorkerPixelSpritesGeneratorMessageInit;

export type IWorkerPixelSpritesGeneratorMessageInit = {
	type: "init";
	data: TinySpriteOptions;
};

interface TinySpriteOptions {
	canvas: OffscreenCanvas;
	seed?: number;
	rows?: number;
	cols?: number;
	spriteSize?: number;
	padding?: number;
	strokeStyle?: string;
}

class TinySpriteGenerator {
	private ctx: OffscreenCanvasRenderingContext2D;
	private seed: number;
	private rows: number;
	private cols: number;
	private spriteSize: number;
	private padding: number;

	constructor(options: TinySpriteOptions) {
		const {
			canvas,
			seed = Date.now(),
			rows = 16,
			cols = 32,
			spriteSize = 8,
			padding = 16,
		} = options;

		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Could not get 2D context");

		this.ctx = ctx;
		this.seed = seed;
		this.rows = rows;
		this.cols = cols;
		this.spriteSize = spriteSize;
		this.padding = padding;

		this.ctx.lineWidth = 2;

		if (options.strokeStyle) {
			this.ctx.strokeStyle = options.strokeStyle;
		}
	}

	private rand(s: { value: number }, i: number): number {
		return (((Math.sin(++s.value + i * i) + 1) * 1e9) % 256) | 0;
	}

	public generate(): void {
		const ctx = this.ctx;
		const { rows, cols, spriteSize, padding } = this;

		const totalSprites = rows * cols;
		const pixelCountBase = 50;

		for (let i = totalSprites; i--; ) {
			for (let pass = 4; pass--; ) {
				const s = { value: this.seed };
				let j = (this.rand(s, i) / 5 + pixelCountBase) | 0;

				while (j--) {
					const X = j & (spriteSize - 1);
					const Y = j >> Math.log2(spriteSize);

					if (this.rand(s, i) < 19) {
						ctx.fillStyle = `rgb(${this.rand(s, i)}, ${this.rand(s, i)}, ${this.rand(s, i)})`;
						continue;
					}

					const withinShape =
						this.rand(s, i) ** 2 / 2000 > X * X + (Y - 5) ** 2;

					if (!withinShape) continue;

					const drawFunc = pass & 2 ? "strokeRect" : "fillRect";

					const spriteX = (i % cols) * padding;
					const spriteY = Math.floor(i / cols) * padding;

					const drawX = 7 + spriteX - (pass % 2) * 2 * X + X;
					const drawY = 2 + spriteY + Y;

					ctx[drawFunc](drawX, drawY, 1, 1);
				}
			}
		}
	}
}

self.addEventListener(
	"message",
	(message: MessageEvent<IWorkerPixelSpritesGeneratorMessage>) => {
		const { data } = message;

		switch (data.type) {
			case "init": {
				const spriteGenerator = new TinySpriteGenerator(data.data);
				spriteGenerator.generate();
				break;
			}
		}
	},
);
