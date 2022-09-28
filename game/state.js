import { overlap } from '../utils/helpers';
import { Commands } from '../events/commands';

const scheduledEventTimers = [];
const scheduledStateUpdates = [];

export class State {
	constructor({level, actors, status, coins, modifiers = []}) {
		this.level = level;
		this.actors = actors;
		this.status = status;
		this.coins = coins;
		this.modifiers = modifiers;
	}
	
	static start(level) {
		return new State({level, actors: level.startActors, status: 'playing', coins: 0});
	}
	
	get player() {
		return this.actors.find((a) => a.type === 'player');
	}
}

State.prototype.update = function (time, movementKeys, eventsToProcess) {
	let actors = this.actors.map((actor) => actor.update(time, this, movementKeys, eventsToProcess));
	let newState = new State({level: this.level, actors, status: this.status, coins: this.coins, modifiers: this.modifiers});
	if (newState.status !== "playing") return newState;

	while (eventsToProcess.length) {
		const eventName = eventsToProcess.pop();
		const event = Commands[eventName];
		
		if (!event || event.inProcess) {continue;}
		
		const {action, schedule} = event;
		
		if(schedule && scheduledEventTimers.includes(schedule)) {continue;}
		
	  newState = action(newState);
		
		if (!schedule) { continue; }
		
		event.inProcess = true;
		scheduledEventTimers.push(
			setTimeout(() => {
				scheduledStateUpdates.push(schedule.action);
				event.inProcess = false;
			}, schedule.delay)
		);
	}
	
	while (scheduledStateUpdates.length) {
		const update = scheduledStateUpdates.pop();
		newState = update(newState);
	}
	
	let player = newState.player;

	for (let actor of actors) {
		if (actor !== player && overlap(actor, player)) {
			newState = actor.collide(newState);
		}
	}
	
	return newState;
};

