import { GAME_LEVELS } from './levels';
import './display/css/dom-display.css';
import { State } from './game/state';
import { Level } from './game/level';
import { trackMovementKeys } from './game/track-movement-keys';
import { trackEventsKeys } from './game/track-events-keys';
import { DOMDisplay } from './display/dom-display';

// Running the game
function runAnimation(frameFunc) {
	let lastTime = null;
	function frame(time) {
		if (lastTime !== null) {
			let timeStep = Math.min(time - lastTime, 100) / 1000;
			if (frameFunc(timeStep) === false) return;
		}
		lastTime = time;
		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}

// Running the level
function runLevel(level, Display, movementKeys, eventsToProcess) {
	let display = new Display(document.body, level);
	let state = State.start(level);
	let ending = 1;
	
	return new Promise((resolve) => {
		runAnimation((time) => {
			state = state.update(time, movementKeys, eventsToProcess);
			display.syncState(state);
			if (state.status === "playing") {
				return true;
			} else if (ending > 0) {
				ending -= time;
				return true;
			} else {
				display.clear();
				resolve(state.status);
				return false;
			}
		});
	});
}

const movementKeys = trackMovementKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);
const eventsToProcess = trackEventsKeys(["s"]);

async function runGame(plans, Display) {
	
	for (let level = 0; level < plans.length; ) {
		let status = await runLevel(new Level(plans[level]), Display, movementKeys, eventsToProcess);
		if (status === "won") level++;
	}
	console.log("You've won!");
}

// let display = new DOMDisplay(document.body, simpleLevel);
// display.syncState(State.start(simpleLevel));

runGame(GAME_LEVELS, DOMDisplay);
