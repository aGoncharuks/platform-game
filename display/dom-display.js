import { elt } from '../utils/helpers';

export const scale = 16;

export const DOMDisplay = class DOMDisplay {
	constructor(parent, level) {
		this.dom = elt('div', {class: 'game'}, drawGrid(level));
		this.actorLayer = null;
		parent.appendChild(this.dom);
	}
	
	clear() {
		this.dom.remove();
	}
};

DOMDisplay.prototype.syncState = function (state) {
	if (this.actorLayer) this.actorLayer.remove();
	if (this.progressLayer) this.progressLayer.remove();
	this.actorLayer = drawActors(state.actors);
	this.progressLayer = drawProgress(state);
	this.dom.appendChild(this.actorLayer);
	this.dom.appendChild(this.progressLayer);
	this.dom.className = `game ${state.status} ${state.modifiers.join(' ')}`;
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

function drawGrid(level) {
	return elt(
		'table',
		{
			class: 'background',
			style: `width: ${level.width * scale}px`,
		},
		...level.rows.map((row) =>
			elt(
				'tr',
				{style: `height: ${scale}px`},
				...row.map(({type, modifiers}) => {
					let elementClass = type;
					if (Array.isArray(modifiers) && modifiers.length) {
						elementClass = [elementClass, ...modifiers].join(' ');
					}
					return elt('td', {class: elementClass})
				})
			)
		)
	);
}

export function drawActors(actors) {
	return elt(
		'div',
		{},
		...actors.map((actor) => {
			let rect = elt('div', {class: `actor ${actor.type}`});
			rect.style.width = `${actor.size.x * scale}px`;
			rect.style.height = `${actor.size.y * scale}px`;
			rect.style.left = `${actor.pos.x * scale}px`;
			rect.style.top = `${actor.pos.y * scale}px`;
			return rect;
		})
	);
}

export function drawProgress(state) {
	const progress = elt(
		'div',
		{class: 'coin-counter'},
		elt('div', {class: 'coin-symbol'}),
		elt('div', {class: 'coin-count'})
	);
	progress.querySelector('.coin-count').textContent = state.coins;
	return progress;
}
