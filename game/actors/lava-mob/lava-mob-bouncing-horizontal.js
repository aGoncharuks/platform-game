import { Vec } from '../../utils/vec';
import { LavaMobBase } from './lava-mob.base';

export class LavaMobBouncingHorizontal extends LavaMobBase {
	
	static create(pos) {
		return new LavaMobBouncingHorizontal(pos, new Vec(LavaMobBase.speedScalar, 0));
	}
}
