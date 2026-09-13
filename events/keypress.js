import { gameState } from "../app.js";
import { moveSelection } from "../util/sudoku.js";

export default function handleKeypress(event) {
	const key = event.key;
	if (key >= "1" && key <= "9") {
		const selectedCell = document.querySelector(".sudoku-cell.selected");
		const grid = gameState.getState().grid;
		if (selectedCell && !selectedCell.dataset.prefilled) {
			const { row, col } = selectedCell.dataset;
			if (gameState.getState().note) {
				if (grid[row][col] !== "0") return; // Don't allow notes in filled cells
				const cellKey = `${row}-${col}-${key}`;
				const notedCells = gameState.getState().notedCells;
				if (notedCells.has(cellKey)) notedCells.delete(cellKey);
				else notedCells.add(cellKey);
				return gameState.setState({ notedCells });
			}
			const notedCells = gameState.getState().notedCells;
			// Remove any notes for this cell when a number is entered
			for (let i = 1; i <= 9; i++) {
				notedCells.delete(`${row}-${col}-${i}`);
			}
			grid[selectedCell.dataset.row][selectedCell.dataset.col] = key;
			gameState.setState({ grid });
		}
	}
	switch (key) {
		case "Backspace":
		case "Delete":
			const selectedCell = document.querySelector(".sudoku-cell.selected");
			if (selectedCell && !selectedCell.dataset.prefilled) {
				const grid = gameState.getState().grid;
				grid[selectedCell.dataset.row][selectedCell.dataset.col] = "0";
				gameState.setState({ grid });
			}
			break;
		case "ArrowUp":
			event.preventDefault();
			moveSelection("up");
			break;
		case "ArrowDown":
			moveSelection("down");
			event.preventDefault();
			break;
		case "ArrowLeft":
			moveSelection("left");
			break;
		case "ArrowRight":
			moveSelection("right");
			break;
	}
}
