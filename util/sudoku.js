import { gameState } from "../app.js";
import { getNewBoard } from "../data/sudokuApi.js";
import handleCellClick from "../events/cellClick.js";
import { clearHighlightedCells, clearSelectedCells } from "./cells.js";

export function getCellSquare(row, col) {
	const squareRow = Math.floor(row / 3);
	const squareCol = Math.floor(col / 3);
	return squareRow * 3 + squareCol;
}

export function getSquareCells(squareIndex) {
	const squareRow = Math.floor(squareIndex / 3);
	const squareCol = squareIndex % 3;
	const cells = [];
	for (let row = squareRow * 3; row < squareRow * 3 + 3; row++) {
		for (let col = squareCol * 3; col < squareCol * 3 + 3; col++) {
			cells.push({ row, col });
		}
	}
	return cells;
}

export function getRowCells(row) {
	const cells = [];
	for (let col = 0; col < 9; col++) {
		cells.push({ row, col });
	}
	return cells;
}

export function getColCells(col) {
	const cells = [];
	for (let row = 0; row < 9; row++) {
		cells.push({ row, col });
	}
	return cells;
}

export function moveSelection(direction) {
	const selectedCell = document.querySelector(".sudoku-cell.selected");
	if (!selectedCell) return;
	let row = parseInt(selectedCell.dataset.row);
	let col = parseInt(selectedCell.dataset.col);

	switch (direction) {
		case "up":
			row = (row - 1 + 9) % 9;
			break;
		case "down":
			row = (row + 1) % 9;
			break;
		case "left":
			col = (col - 1 + 9) % 9;
			break;
		case "right":
			col = (col + 1) % 9;
			break;
	}
	gameState.setState({ selectedCell: { row, col } });
}

export function selectCell(row, col) {
	clearHighlightedCells();
	clearSelectedCells();
	const cell = document.getElementById(`cell-${row}-${col}`);
	if (cell && !cell.disabled) {
		cell.classList.add("selected");
		const squareIndex = getCellSquare(row, col);
		const highlightedCells = [];
		highlightedCells.push(getSquareCells(squareIndex));
		highlightedCells.push(getRowCells(row));
		highlightedCells.push(getColCells(col));
		highlightedCells.forEach((cells) => {
			cells.forEach(({ row, col }) => {
				const cellToHighlight = document.getElementById(`cell-${row}-${col}`);
				if (cellToHighlight && cellToHighlight !== cell) {
					cellToHighlight.classList.add("highlighted");
				}
			});
		});
	}
}

export function createCell({ row, col, value = "", prefilled = false }) {
	const cell = document.createElement("div");
	cell.id = `cell-${row}-${col}`;
	cell.dataset.row = row;
	cell.dataset.col = col;
	cell.type = "text";
	cell.maxLength = 1;
	cell.size = 1;
	cell.classList.add("sudoku-cell");
	const valueElement = document.createElement("span");
	valueElement.classList.add("cell-value");
	valueElement.textContent = value !== "0" ? value : "";
	cell.appendChild(valueElement);
	cell.style.userSelect = "none";
	const noteContainer = document.createElement("div");
	noteContainer.classList.add("note-container");
	noteContainer.id = `note-container-${row}-${col}`;
	for (let i = 1; i <= 9; i++) {
		const noteNumber = document.createElement("div");
		noteNumber.textContent = i;
		noteNumber.classList.add("note-number");
		noteNumber.id = `note-${row}-${col}-${i}`;
		noteContainer.appendChild(noteNumber);
	}
	cell.appendChild(noteContainer);
	if (row % 3 === 0 && row !== 0) {
		cell.classList.add("top-border");
	}
	if (col % 3 === 0 && col !== 0) {
		cell.classList.add("left-border");
	}
	cell.addEventListener("click", handleCellClick);
	if (prefilled) {
		cell.dataset.prefilled = "true";
	}
	return cell;
}

export function initializeGame({ puzzle, solution, difficulty }) {
	gameState.setState({
		puzzle,
		solution,
		difficulty,
		grid: Array.from(puzzle, (row) => [...row]),
	});
	createGrid({ puzzle });
}

export function resetGame() {
	const { puzzle } = gameState.getState();
	gameState.setState({
		grid: Array.from(puzzle, (row) => [...row]),
		selectedCell: undefined,
		note: false,
		notedCells: new Set(),
	});
	console.log(gameState);
}

export function createGrid({ puzzle }) {
	const grid = document.getElementById("sudoku-grid");
	grid.innerHTML = "";
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			const cell = createCell({
				row,
				col,
				value: puzzle[row][col],
				prefilled: puzzle[row][col] !== "0",
			});
			grid.appendChild(cell);
		}
	}
}

export function updateGrid({ grid: newGrid }) {
	const cells = document.querySelectorAll(".sudoku-cell");
	cells.forEach((cell) => {
		const row = parseInt(cell.dataset.row);
		const col = parseInt(cell.dataset.col);
		const valueElement = cell.querySelector(".cell-value");
		valueElement.textContent =
			newGrid[row][col] !== "0" ? newGrid[row][col] : "";
		// cell.textContent = newGrid[row][col] !== "0" ? newGrid[row][col] : "";
	});
}

export function checkSolution() {
	const { grid, solution } = gameState.getState();
	if (!grid || !solution) return false;
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (grid[row][col] !== solution[row][col]) {
				// check if you want to highlight the incorrect cell
				// const cell = document.getElementById(`cell-${row}-${col}`);
				// if (cell) {
				// 	cell.classList.add("incorrect");
				// }

				return false;
			}
		}
	}
	return true;
}

export function startNewGame(difficulty) {
	getNewBoard({ difficulty })
		.then((newBoard) => {
			initializeGame(newBoard);
		})
		.catch((error) => {
			console.error("Error fetching new board:", error);
		});
}
