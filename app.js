import { getNewBoard } from "./data/sudokuApi.js";
import handleGameButtonClick from "./events/gameButtons.js";
import handleKeypress from "./events/keypress.js";
import State from "./model/State.js";
import { clearHighlightedCells, clearSelectedCells } from "./util/cells.js";
import {
	initializeGame,
	resetGame,
	selectCell,
	updateGrid,
} from "./util/sudoku.js";

const examplePuzzle = {
	difficulty: "medium",
	puzzle: [
		["4", "0", "0", "9", "8", "0", "6", "0", "0"],
		["0", "0", "2", "0", "0", "0", "8", "0", "0"],
		["5", "0", "0", "0", "0", "0", "0", "0", "0"],
		["9", "4", "5", "0", "0", "0", "7", "0", "0"],
		["0", "3", "0", "0", "0", "2", "0", "0", "0"],
		["0", "0", "6", "0", "0", "9", "4", "0", "0"],
		["6", "0", "0", "2", "4", "8", "0", "9", "0"],
		["0", "8", "0", "0", "5", "7", "0", "0", "4"],
		["0", "7", "4", "3", "0", "6", "2", "0", "0"],
	],
	solution: [
		["4", "1", "7", "9", "8", "5", "6", "3", "2"],
		["3", "9", "2", "6", "1", "4", "8", "7", "5"],
		["5", "6", "8", "7", "2", "3", "9", "4", "1"],
		["9", "4", "5", "8", "3", "1", "7", "2", "6"],
		["7", "3", "1", "4", "6", "2", "5", "8", "9"],
		["8", "2", "6", "5", "7", "9", "4", "1", "3"],
		["6", "5", "3", "2", "4", "8", "1", "9", "7"],
		["2", "8", "9", "1", "5", "7", "3", "6", "4"],
		["1", "7", "4", "3", "9", "6", "2", "5", "8"],
	],
};

export const gameState = new State({
	puzzle: undefined,
	solution: undefined,
	difficulty: undefined,
	grid: undefined,
	selectedCell: undefined,
	note: false,
	notedCells: new Set(),
});

document.addEventListener("keydown", handleKeypress);
document.querySelectorAll(".game-button").forEach((button) => {
	button.addEventListener("click", handleGameButtonClick);
});
document.querySelector("#new-game").addEventListener("click", () => {
	/** @type{HTMLSelectElement} */
	const difficultySelect = document.querySelector("#difficulty-select");
	const selectedDifficulty = difficultySelect.value;
	getNewBoard({ difficulty: selectedDifficulty })
		.then((newBoard) => {
			initializeGame(newBoard);
		})
		.catch((error) => {
			console.error("Error fetching new board:", error);
		});
	//initializeGame(examplePuzzle);
});

gameState.subscribe(updateGrid);
gameState.subscribe((state) => {
	const { selectedCell } = state;
	if (selectedCell) {
		const { row, col } = selectedCell;
		selectCell(row, col);
	} else {
		clearHighlightedCells();
		clearSelectedCells();
	}
});
gameState.subscribe((state) => {
	const { note, notedCells } = state;
	const noteButton = document.querySelector("#note-button");
	if (note) {
		noteButton.classList.add("active");
	} else {
		noteButton.classList.remove("active");
	}
	document.querySelectorAll(".note-number").forEach((note) => {
		const [_, row, col, number] = note.id.split("-");
		if (notedCells.has(`${row}-${col}-${number}`)) {
			note.classList.add("visible");
		} else {
			note.classList.remove("visible");
		}
	});
});

initializeGame(examplePuzzle);

window.resetGame = resetGame;
