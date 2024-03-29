import { Vec } from '../utils/vec';
import { State } from '../core/state';

const wobbleSpeed = 8;
const	wobbleDist = 0.07;

export class Coin {
	constructor(pos, basePos, wobble) {
		this.pos = pos;
		this.basePos = basePos;
		this.wobble = wobble;
	}

	get type() {
		return 'coin';
	}

	static create(pos) {
		let basePos = pos.plus(new Vec(0.2, 0.1));
		return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
	}
}

Coin.prototype.size = new Vec(0.6, 0.6);

Coin.prototype.collide = function (state) {
	let actors = state.actors.filter((a) => a !== this);
	let coins = state.coins + 1;
	return new State({...state, actors, coins});
};

Coin.prototype.update = function (time) {
	let wobble = this.wobble + time * wobbleSpeed;
	let wobblePos = Math.sin(wobble) * wobbleDist;
	return new Coin(
		this.basePos.plus(new Vec(0, wobblePos)),
		this.basePos,
		wobble
	);
};

