import { State } from '../game/state';

export const Commands = {
	's': {
		action: (state) => {
			if (state.coins <= 0) { return state; }
			
			return new State({
				...state,
				coins: state.coins - 1,
				modifiers: ['show-inivisible-walls']
			});
		},
		schedule: {
			action: (state) => new State({
				...state,
				modifiers: state.modifiers.filter(modifier => modifier !== 'show-inivisible-walls')
			}),
			delay: 4000
		},
		inProcess: false
	}
}
