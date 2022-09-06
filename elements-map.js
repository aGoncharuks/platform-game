import { Player } from 'player';

export const ELEMENTS_MAP = {
	'.': {type: 'empty'},
	'#': {type: 'wall'},
	'i': {type: 'wall', modifiers: ['invisible']},
	'+': {type: 'lava'},
	'@': {type: Player},
	'c': {type: 'coin'},
	'w': {type: 'water'},
}
