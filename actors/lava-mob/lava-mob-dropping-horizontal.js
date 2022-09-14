import { Vec } from '../../utils/vec';
import { LavaMobBase } from './lava-mob.base';

export class LavaMobDroppingHorizontal extends LavaMobBase {
	
	static create(pos) {
		return new LavaMobDroppingHorizontal(pos, new Vec(10, 0), pos);
	}
}
