import { overlap } from '../utils/utils';

export class State {
	constructor(level, actors, status, coins) {
		this.level = level;
		this.actors = actors;
		this.status = status;
		this.coins = coins;
	}
	
	static start(level) {
		return new State(level, level.startActors, 'playing', 0);
	}
	
	get player() {
		return this.actors.find((a) => a.type === 'player');
	}
}

State.prototype.update = function (time, keys) {
	let actors = this.actors.map((actor) => actor.update(time, this, keys));
	let newState = new State(this.level, actors, this.status, this.coins);
	if (newState.status !== "playing") return newState;

	let player = newState.player;

	for (let actor of actors) {
		if (actor !== player && overlap(actor, player)) {
			newState = actor.collide(newState);
		}
	}
	return newState;
};

