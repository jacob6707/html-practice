import { gameState } from "../app.js";

/** @param {PointerEvent} event */
export default function handleCellClick(event) {
	/** @type {HTMLDivElement} */
	const cell = event.target;
	const row = parseInt(cell.dataset.row);
	const col = parseInt(cell.dataset.col);
	gameState.setState({ selectedCell: { row, col } });
}
