import {
	playNote,
} from './audio.mjs';
import {
	retrieveHighScore,
	retrieveOctaves,
	storeHighScore,
	storeOctaves,
} from './storage.mjs';

// DOM elements.
const resultText = document.getElementById('result');
const detailsText = document.getElementById('details');
const continueButton = document.getElementById('continue');
const tryAgainButton = document.getElementById('tryAgain');
const pianoKeys = document.getElementsByClassName('pianoKey');
const octaveButtons = document.getElementsByClassName('selector');
const startButton = document.getElementById('start');
const setupArea = document.getElementById('setup');
const gameArea = document.getElementById('game');

// Globals.
const octaves = [];
const answer = {};
let score = 0;

// Select a new random note and octave.
function chooseRandomNote() {
	const randomInt = (max) => max * Math.random() << 0;
	const octave = octaves[randomInt(octaves.length)];
	const index = randomInt(pianoKeys.length);
	answer['index'] = index;
	answer['octave'] = octave;
	answer['shown'] = false;
}

// Place the piano keys in their default state, with none selected.
function resetPianoKeys() {
	for (const element of pianoKeys) {
		element.classList = 'pianoKey';
	}
}

// Return the distance in half-notes from the correct answer.
function answerDistance(index) {
	const distance = Math.abs(index - answer['index']);
	if (distance === 11) return 1;
	return distance;
}

// Check current score against high score and reveal both to the player.
function checkHighScore() {
	const record = retrieveHighScore();
	detailsText.innerHTML = 'Your score: ' + score;
	detailsText.innerHTML += '<br>';
	detailsText.innerHTML += 'High score: ' + record;
	if (score > record) {
		storeHighScore(score);
	}
}

// Check the guess against the answer and update the UI accordingly.
function submitHandler(index) {
	if (answer['shown']) {
		return playNote(index, answer['octave']);
	}
	answer['shown'] = true;
	pianoKeys[answer['index']].classList.add('correct');
	const distance = answerDistance(index);
	if (distance == 0) {
		resultText.textContent = 'Correct!';
		detailsText.textContent = '+1 point';
		score += 1;
		continueButton.classList.remove('hidden');
	} else if (distance == 1) {
		resultText.textContent = 'Close...';
		continueButton.classList.remove('hidden');
		pianoKeys[index].classList.add('incorrect');
	} else {
		resultText.textContent = 'Game Over';
		checkHighScore();
		pianoKeys[index].classList.add('incorrect');
		tryAgainButton.classList.remove('hidden');
	}
}

// Add the click handlers to the piano keys.
function setPianoKeyHandlers() {
	for (let i = 0; i < pianoKeys.length; i += 1) {
		pianoKeys[i].addEventListener('click', () => submitHandler(i));
	}
}

// Reset the board and select a new note for the player to guess.
function continueHandler() {
	chooseRandomNote();
	resetPianoKeys();
	resultText.textContent = '';
	detailsText.textContent = '';
	continueButton.classList.add('hidden');
	playNote(answer['index'], answer['octave']);
}

// Reset the score and start a new game with the same octaves.
function tryAgainHandler() {
	score = 0;
	tryAgainButton.classList.add('hidden');
	continueHandler();
}

// Add an octave if it's missing, or remove it if it already exists.
function toggleOctave(octave) {
	if (octaves.includes(octave)) {
		octaves.splice(octaves.indexOf(octave), 1);
	} else {
		octaves.push(octave);
	}
}

// Add/remove the selected octave to/from the list of octaves to use.
function octaveClickHandler(index) {
	octaveButtons[index].classList.toggle('selected');
	toggleOctave(index + 1);
	startButton.disabled = octaves.length < 1;
}

// Add the click handler to the octave selectors.
function setOctaveHandlers() {
	for (let i = 0; i < octaveButtons.length; i += 1) {
		octaveButtons[i].addEventListener('click', () => octaveClickHandler(i));
	}
	retrieveOctaves().forEach(item => octaveClickHandler(item - 1));
}

// Start the game with the selected octaves.
function startHandler() {
	storeOctaves(octaves);
	setupArea.classList.add('hidden');
	gameArea.classList.remove('hidden');
	continueButton.addEventListener('click', continueHandler);
	tryAgainButton.addEventListener('click', tryAgainHandler);
	setPianoKeyHandlers();
	continueHandler();
}

// Activate the start button and the octave selectors.
startButton.addEventListener('click', startHandler);
setOctaveHandlers();
