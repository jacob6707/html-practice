import { gameState } from "../app.js";
import { checkSolution, resetGame } from "../util/sudoku.js";
import handleKeypress from "./keypress.js";

/**
 * @param {PointerEvent} event
 */
export default function handleGameButtonClick(event) {
	/** @type {HTMLButtonElement} */
	const button = event.target;
	const id = button.id;

	if (id.startsWith("number-")) {
		const number = id.split("-")[1];
		return handleKeypress({ key: number });
	}

	switch (id) {
		case "check-button":
			if (checkSolution()) {
				alert("Congratulations! You solved the puzzle!");
			} else {
				alert("The solution is incorrect. Please try again.");
			}
			break;
		case "eraser-button":
			handleKeypress({ key: "Backspace" });
			break;
		case "reset-button":
			resetGame();
			break;
		case "note-button":
			gameState.setState({ note: !gameState.getState().note });
			break;
	}
}
