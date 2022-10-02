import { Vec } from '../utils/vec';
import { State } from '../game/state';

export class Lava {
	constructor(pos) {
		this.pos = pos;
	}
	
	get type() {
		return 'lava';
	}
	
	static create(pos) {
		return new Lava(pos);
	}
}

Lava.prototype.size = new Vec(1, 1);

Lava.prototype.collide = function (state) {
	return new State({...state, status: 'lost'});
};

Lava.prototype.update = function () {
	return this;
};
