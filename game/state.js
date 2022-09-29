import { overlap } from '../utils/helpers';

export class State {
	constructor({level, actors, status, coins, modifiers = []}) {
		this.level = level;
		this.actors = actors;
		this.status = status;
		this.coins = coins;
		this.modifiers = modifiers;
	}
	
	static start(level, stateToTransfer = {}) {
		return new State({
			level,
			actors: level.startActors,
			status: 'playing',
			coins: stateToTransfer.coins || 0
		});
	}
	
	get player() {
		return this.actors.find((a) => a.type === 'player');
	}
}

State.prototype.update = function (time, movementKeys, commands) {
	let actors = this.actors.map((actor) => actor.update(time, this, movementKeys, commands));
	let newState = new State({level: this.level, actors, status: this.status, coins: this.coins, modifiers: this.modifiers});
	if (newState.status !== "playing") return newState;

	while (commands.length) {
		const command = commands.pop();
		const {action, cleanup} = command;
	  newState = action(newState);
		
		if (!cleanup) { continue; }
		
		if (command.timeoutId) {
			clearTimeout(command.timeoutId);
		}
		
		command.timeoutId = setTimeout(() => commands.push(cleanup), cleanup.delay);
	}
	
	let player = newState.player;

	for (let actor of actors) {
		if (actor !== player && overlap(actor, player)) {
			newState = actor.collide(newState);
		}
	}
	
	return newState;
};

