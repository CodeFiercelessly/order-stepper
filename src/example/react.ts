import OrderStepper, { ITrigger, IStepFunction } from '..';

interface IState {
	value: number;
}

const trigger: ITrigger<IState> = {
	cond: ({ state: { value } }) => value <= 4,
	after: ({ state }) => state.value++,
};

const stepFunction: IStepFunction<IState> = {
	1: next => {
		console.log('First step got called');
		RequestReset(next);
	},
	2: next => {
		console.log('Second step got called');
		ShowConfirmReset(next);
	},
	3: next => {
		console.log(
			"Third step got called but I won't do any operation because so state value didn't check out, I will skip",
		);
		if (true) {
			// Do some check with state. if true skip;
			next(); // skipping
		}
		// if my state check didn't pass, I will be here
		// SomeFunction(next)
	},
	4: next => {
		console.log('Fourth step got called');
		RequestSent(next);
	},
	5: () => {
		// Because the stepFunction condition will only be true when the incremented state.value is <= 4, this step won't get called
		console.log('Fifth step got called');
	},
};

const initialState: IState = {
	value: 1,
};

const RequestReset = (next: () => void) => {
	console.log(
		'==== Showing form four user to type in their email for password reset and will simulate submission after 2000ms =====',
	);
	const interval = setInterval(() => {
		clearInterval(interval);
		next();
	}, 2000);
};

const ShowConfirmReset = (next: () => void) => {
	console.log('==== Showing form for user to click confirm and will simulate click after 2000ms =====');
	const interval = setInterval(() => {
		clearInterval(interval);
		next();
	}, 2000);
};

const RequestSent = (next: () => void) => {
	console.log('===== Showing successful submission form to user and will simulate a click after 2000ms =====');
	const interval = setInterval(() => {
		clearInterval(interval);
		next();
	}, 2000);
};

const process = new OrderStepper(initialState, stepFunction, trigger);

const BeginOperation = () => {
	console.log('=== I will begin everything ====');
	process.trigger();
};

BeginOperation();
