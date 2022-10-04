import { Vec } from '../../utils/vec';
import { LavaMobBase } from './lava-mob.base';

export class LavaMobDroppingVertical extends LavaMobBase {
	
	static create(pos) {
		return new LavaMobDroppingVertical(pos, new Vec(0, LavaMobBase.speedScalar), pos);
	}
}
