import { Player } from 'player';

export const ELEMENTS_MAP = {
	'.': {type: 'empty'},
	'#': {type: 'wall'},
	'i': {type: 'wall', modifiers: ['invisible']},
	'+': {type: 'lava'},
	'@': {type: Player},
	'/': {type: 'money'},
    'w': {type: 'water'},
}
