import { Player } from 'player';

export const ELEMENTS_MAP = {
	'.': {type: 'empty'},
	'#': {type: 'wall'},
	'+': {type: 'lava'},
	'@': {type: Player}
}
