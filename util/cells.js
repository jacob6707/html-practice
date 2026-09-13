export function clearHighlightedCells() {
	const cells = document.querySelectorAll(".sudoku-cell.highlighted");
	cells.forEach((cell) => {
		cell.classList.remove("highlighted");
	});
}

export function clearSelectedCells() {
	const cells = document.querySelectorAll(".sudoku-cell.selected");
	cells.forEach((cell) => {
		cell.classList.remove("selected");
	});
}
