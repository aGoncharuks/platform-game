import { GAME_LEVELS } from './levels';
import './display/css/dom-display.css';
import { Vec } from './utils/vec';
import { ELEMENTS_MAP } from './elements-map';
import { State } from './game/state';

const Level = class Level {
	constructor(plan) {
		let rows = plan
			.trim()
			.split("\n")
			.map((l) => [...l]);
		this.height = rows.length;
		this.width = rows[0].length;
		this.startActors = [];

		this.rows = rows.map((row, y) => {
			return row.map((ch, x) => {
				const element = ELEMENTS_MAP[ch];
				
				if (typeof element.type === "string") {
					return element;
				}
				
				this.startActors.push(
					element.type.create(new Vec(x, y), ch)
				);
				
				return { type: 'empty' };
			});
		});
	}
};

function elt(name, attrs, ...children) {
	let dom = document.createElement(name);
	for (let attr of Object.keys(attrs)) {
		dom.setAttribute(attr, attrs[attr]);
	}
	for (let child of children) {
		dom.appendChild(child);
	}
	return dom;
}

const DOMDisplay = class DOMDisplay {
	constructor(parent, level) {
		this.dom = elt("div", { class: "game" }, drawGrid(level));
		this.actorLayer = null;
		parent.appendChild(this.dom);
	}

	clear() {
		this.dom.remove();
	}
};

const scale = 16;

function drawGrid(level) {
	return elt(
		"table",
		{
			class: "background",
			style: `width: ${level.width * scale}px`,
		},
		...level.rows.map((row) =>
			elt(
				"tr",
				{style: `height: ${scale}px`},
				...row.map(({type, modifiers}) => {
					let elementClass = type;
					if (Array.isArray(modifiers) && modifiers.length) {
						elementClass+= modifiers.join(' ');
					}
					return elt('td', {class: elementClass})
				})
			)
		)
	);
}

function drawActors(actors) {
	return elt(
		"div",
		{},
		...actors.map((actor) => {
			let rect = elt("div", { class: `actor ${actor.type}` });
			rect.style.width = `${actor.size.x * scale}px`;
			rect.style.height = `${actor.size.y * scale}px`;
			rect.style.left = `${actor.pos.x * scale}px`;
			rect.style.top = `${actor.pos.y * scale}px`;
			return rect;
		})
	);
}

function drawProgress(state) {
	const progress = elt(
		"div",
		{ class: "coin-counter" },
		elt("div", { class: "coin-symbol" }),
		elt("div", { class: "coin-count" })
	);
	progress.querySelector(".coin-count").textContent = state.coins;
	return progress;
}

DOMDisplay.prototype.syncState = function (state) {
	if (this.actorLayer) this.actorLayer.remove();
	if (this.progressLayer) this.progressLayer.remove();
	this.actorLayer = drawActors(state.actors);
	this.progressLayer = drawProgress(state);
	this.dom.appendChild(this.actorLayer);
	this.dom.appendChild(this.progressLayer);
	this.dom.className = `game ${state.status}`;
	this.scrollPlayerIntoView(state);
};

DOMDisplay.prototype.scrollPlayerIntoView = function (state) {
	let width = this.dom.clientWidth;
	let height = this.dom.clientHeight;
	let margin = width / 3;

	// The viewport
	let left = this.dom.scrollLeft,
		right = left + width;
	let top = this.dom.scrollTop,
		bottom = top + height;

	let player = state.player;
	let center = player.pos.plus(player.size.times(0.5)).times(scale);

	if (center.x < left + margin) {
		this.dom.scrollLeft = center.x - margin;
	} else if (center.x > right - margin) {
		this.dom.scrollLeft = center.x + margin - width;
	}
	if (center.y < top + margin) {
		this.dom.scrollTop = center.y - margin;
	} else if (center.y > bottom - margin) {
		this.dom.scrollTop = center.y + margin - height;
	}
};

Level.prototype.touches = function (pos, size, type) {
	const xStart = Math.floor(pos.x);
	const xEnd = Math.ceil(pos.x + size.x);
	const yStart = Math.floor(pos.y);
	const yEnd = Math.ceil(pos.y + size.y);

	for (let y = yStart; y < yEnd; y++) {
		for (let x = xStart; x < xEnd; x++) {
			let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
			let here = isOutside ? "wall" : this.rows[y][x].type;
			if (here === type) return true;
		}
	}
	return false;
};

function trackKeys(keys) {
	let down = Object.create(null);
	function track(event) {
		if (keys.includes(event.key)) {
			down[event.key] = event.type === "keydown";
			event.preventDefault();
		}
	}
	window.addEventListener("keydown", track);
	window.addEventListener("keyup", track);
	return down;
}

const arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);

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
function runLevel(level, Display) {
	let display = new Display(document.body, level);
	let state = State.start(level);
	let ending = 1;
	return new Promise((resolve) => {
		runAnimation((time) => {
			state = state.update(time, arrowKeys);
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

async function runGame(plans, Display) {
	for (let level = 0; level < plans.length; ) {
		let status = await runLevel(new Level(plans[level]), Display);
		if (status === "won") level++;
	}
	console.log("You've won!");
}

// let display = new DOMDisplay(document.body, simpleLevel);
// display.syncState(State.start(simpleLevel));
runGame(GAME_LEVELS, DOMDisplay);
