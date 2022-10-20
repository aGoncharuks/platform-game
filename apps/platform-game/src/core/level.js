import { ELEMENTS_MAP } from '../config/elements-map';
import { Vec } from '../utils/vec';

export const Level = class Level {
	constructor(plan) {
		let rows = plan
			.map((l) => [...l]);
		this.height = rows.length;
		this.width = rows[0].length;
		this.startActors = [];

		this.rows = rows.map((row, y) => {
			return row.map((ch, x) => {
				const element = ELEMENTS_MAP[ch];

				if (typeof element.type === 'string') {
					return element;
				}

				this.startActors.push(
					element.type.create(new Vec(x, y), ch)
				);

				return {type: 'empty'};
			});
		});
	}
};

Level.prototype.touches = function (pos, size, type) {
	const xStart = Math.floor(pos.x);
	const xEnd = Math.ceil(pos.x + size.x);
	const yStart = Math.floor(pos.y);
	const yEnd = Math.ceil(pos.y + size.y);

	for (let y = yStart; y < yEnd; y++) {
		for (let x = xStart; x < xEnd; x++) {
			let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
			let here = isOutside ? "wall" : this.rows[y][x].type;
			if (here === type) return true;
		}
	}
	return false;
};
