export default class State {
	#state;
	#listeners;
	constructor(initialState = {}) {
		this.#state = initialState;
		this.#listeners = [];
	}

	subscribe(listener) {
		this.#listeners.push(listener);
		return () => {
			this.#listeners = this.#listeners.filter((l) => l !== listener);
		};
	}

	setState(newState) {
		this.#state = { ...this.#state, ...newState };
		this.notify();
	}

	getState() {
		return structuredClone(this.#state); // Return a copy to prevent direct manipulation
	}

	notify() {
		this.#listeners.forEach((listener) => listener(this.getState()));
	}
}
