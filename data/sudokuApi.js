/*
// unusable because of CORS issues

const API_URL = "https://youdosudoku.com/api/";
const API_KEY = "nF-z75GdQCKn97nxShzVkHpa8DbO58uD1eJxPw35QFI";

export async function getNewBoard({ difficulty = "easy" }) {
	return await fetch(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": API_KEY,
		},
		body: JSON.stringify({ difficulty, solution: true, array: true }),
	})
		.then((response) => response.json())
		.then((data) => {
			const { puzzle, solution } = data;
			return { puzzle, solution, difficulty };
		});
}
*/

const jsonPuzzles = [];

async function loadPuzzles() {
	if (jsonPuzzles.length === 0) {
		const response = await fetch("./data/sudoku.json");

		if (!response.ok) {
			throw new Error(`Unable to load sudoku.json: ${response.status}`);
		}

		const data = await response.json();
		jsonPuzzles.push(...data);
	}

	return jsonPuzzles;
}

export async function getNewBoard({ difficulty = "easy" }) {
	const puzzles = await loadPuzzles();

	const difficultyPuzzles = puzzles.filter(
		(puzzle) => puzzle.difficulty === difficulty,
	);

	const randomIndex = Math.floor(Math.random() * difficultyPuzzles.length);
	const { puzzle, solution } = difficultyPuzzles[randomIndex];

	return { puzzle, solution, difficulty };
}
