import { ELEMENTS_MAP } from 'elements-map';
import { Vec } from 'vec';

export class Level {
  constructor(plan) {
    let rows = plan.trim().split("\n").map(l => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
				const element = ELEMENTS_MAP[ch];
        if (typeof element.type == "string") {
					return element;
				}
        this.startActors.push(
          element.type.create(new Vec(x, y), ch)
				);
        return { type: 'empty' };
      });
    });
  }
}

Level.prototype.touches = function(pos, size, type) {
  let xStart = Math.floor(pos.x);
  let xEnd = Math.ceil(pos.x + size.x);
  let yStart = Math.floor(pos.y);
  let yEnd = Math.ceil(pos.y + size.y);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let isOutside = x < 0 || x >= this.width ||
                      y < 0 || y >= this.height;
      let here = isOutside ? "wall" : this.rows[y][x].type;
      if (here === type) return true;
    }
  }
  return false;
};
