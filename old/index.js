import GAME_LEVELS from './levels.json';
import './display/css/dom-display.css';
import { State } from './game/state';
import { Level } from './game/level';
import { trackMovementKeys } from './game/track-movement-keys';
import { trackKeyDownComands } from './game/track-key-down-comands';
import { DOMDisplay } from './display/dom-display';
import { COMMANDS } from './commands/commands';

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
function runLevel(level, Display, movementKeys, commands, stateToTransfer) {
	let display = new Display(document.body, level);
	let state = State.start(level, stateToTransfer);
	let ending = 1;

	return new Promise((resolve) => {
		runAnimation((time) => {
			state = state.update(time, movementKeys, commands);
			display.syncState(state);
			if (state.status === "playing") {
				return true;
			} else if (ending > 0) {
				ending -= time;
				return true;
			} else {
				display.clear();
				resolve(state);
				return false;
			}
		});
	});
}

const movementKeys = trackMovementKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);
const commands = trackKeyDownComands(COMMANDS);

async function runGame(plans, Display) {
	let state = {};
	for (let level = 0; level < plans.length; ) {
		state = await runLevel(new Level(plans[level]), Display, movementKeys, commands, state);
		if (state.status === "won") level++;
	}
	console.log("You've won!");
}

// let display = new DOMDisplay(document.body, simpleLevel);
// display.syncState(State.start(simpleLevel));

runGame(GAME_LEVELS, DOMDisplay);
