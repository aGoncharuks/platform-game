import { Player } from './actors/player';
import { Coin } from './actors/coin';
import { LavaMobBouncingVertical } from './actors/lava-mob/lava-mob-bouncing-vertical';
import { Lava } from './actors/lava';
import { LavaMobBouncingHorizontal } from './actors/lava-mob/lava-mob-bouncing-horizontal';
import { LavaMobDroppingVertical } from './actors/lava-mob/lava-mob-dropping-vertical';
import { LavaMobDroppingHorizontal } from './actors/lava-mob/lava-mob-dropping-horizontal';

export const ELEMENTS_MAP = {
	'.': {type: 'empty'},
	'#': {type: 'wall'},
	'i': {type: 'wall', modifiers: ['invisible']},
	'+': {type: Lava},
	'@': {type: Player},
	'c': {type: Coin},
	'w': {type: 'water'},
	'^': {type: LavaMobDroppingVertical},
	'>': {type: LavaMobDroppingHorizontal},
	'|': {type: LavaMobBouncingVertical},
	'-': {type: LavaMobBouncingHorizontal},
};
