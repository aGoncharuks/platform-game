import { Player } from './actors/player';
import { Coin } from './actors/coin';
import { LavaMobBouncingVertical } from './actors/lava-mob/lava-mob-bouncing-vertical';
import { Lava } from './actors/lava';
import { LavaMobBouncingHorizontal } from './actors/lava-mob/lava-mob-bouncing-horizontal';
import { LavaMobDroppingVertical } from './actors/lava-mob/lava-mob-dropping-vertical';
import { LavaMobDroppingHorizontal } from './actors/lava-mob/lava-mob-dropping-horizontal';
import { Exit } from './actors/exit';

export const ELEMENTS_MAP = {
	'.': {type: 'empty'},
	'#': {type: 'wall'},
	'i': {type: 'wall', modifiers: ['invisible']},
	'w': {type: 'water'},
	'+': {type: Lava},
	'@': {type: Player},
	'c': {type: Coin},
	'e': {type: Exit},
	'^': {type: LavaMobDroppingVertical},
	'>': {type: LavaMobDroppingHorizontal},
	'|': {type: LavaMobBouncingVertical},
	'-': {type: LavaMobBouncingHorizontal},
};
