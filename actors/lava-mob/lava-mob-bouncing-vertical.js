import { Vec } from '../../utils/vec';
import { LavaMobBase } from './lava-mob.base';

export class LavaMobBouncingVertical extends LavaMobBase {
	
	static create(pos) {
		return new LavaMobBouncingVertical(pos, new Vec(0, LavaMobBase.speedScalar));
	}
}
