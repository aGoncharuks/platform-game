import { Vec } from '../../utils/vec';
import { State } from '../../core/state';

export class LavaMobBase {
	constructor(pos, speed, reset = null) {
		this.pos = pos;
		this.speed = speed;
		this.reset = reset;
	}

	get type() {
		return 'lava';
	}

	static get speedScalar() {
		return 10;
	}
}

LavaMobBase.prototype.size = new Vec(1, 1);


LavaMobBase.prototype.collide = function (state) {
	return new State({...state, status: 'lost'});
};

LavaMobBase.prototype.update = function (time, state) {
	let newPos = this.pos.plus(this.speed.times(time));
	if (!state.level.touches(newPos, this.size, "wall")) {
		return new LavaMobBase(newPos, this.speed, this.reset);
	} else if (this.reset) {
		return new LavaMobBase(this.reset, this.speed, this.reset);
	} else {
		return new LavaMobBase(this.pos, this.speed.times(-1));
	}
};
