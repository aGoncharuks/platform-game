import { Vec } from '../utils/vec';
import { State } from '../core/state';

export class Exit {
	constructor(pos) {
		this.pos = pos;
	}

	get type() {
		return 'exit';
	}

	static create(pos) {
		return new Exit(pos);
	}
}

Exit.prototype.size = new Vec(1, 1);

Exit.prototype.collide = function (state) {
	return new State({...state, status: 'won'});
};

Exit.prototype.update = function () {
	return this;
};
