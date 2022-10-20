import { State } from '../core/state';

export const COMMANDS = {
	s: {
		action: (state) => {
			if (state.coins <= 0) { return state; }

			return new State({
				...state,
				coins: state.coins - 1,
				modifiers: ['show-inivisible-walls']
			});
		},
		cleanup: {
			action: (state) => new State({
				...state,
				modifiers: state.modifiers.filter(modifier => modifier !== 'show-inivisible-walls')
			}),
			delay: 4000
		}
	}
}

