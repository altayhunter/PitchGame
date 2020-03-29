import {
	noteNames,
	noteFrequencies,
} from './notes.mjs';

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
const siteName = 'pitch';
const octaves = [];
const answer = {};
let score = 0;

// Select a new random note and clear the guess input.
function chooseRandomNote() {
	const randomInt = (max) => max * Math.random() << 0;
	const octave = octaves[randomInt(octaves.length)];
	const index = randomInt(pianoKeys.length);
	answer['index'] = index;
	answer['note'] = noteNames[index];
	answer['octave'] = octave;
	answer['freq'] = noteFrequencies[octave][index];
	resetPianoKeys();
}

// Audibly play the frequency for half a second.
function playNote(frequency) {
	const duration = 1.1;
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	const oscillator = audioCtx.createOscillator();
	oscillator.type = 'square';
	oscillator.frequency.value = frequency;
	const sweepEnv = audioCtx.createGain();
	sweepEnv.gain.cancelScheduledValues(audioCtx.currentTime);
	sweepEnv.gain.setValueAtTime(0, audioCtx.currentTime);
	sweepEnv.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.1);
	sweepEnv.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration - 0.3);
	oscillator.connect(sweepEnv).connect(audioCtx.destination);
	oscillator.start();
	oscillator.stop(audioCtx.currentTime + duration);
}

// Place the piano keys in their default state, with none selected.
function resetPianoKeys() {
	for (const element of pianoKeys) {
		element.classList = 'pianoKey';
	}
}

// Return whether the answer has already been revealed to the player.
function answerRevealed() {
	for (const element of pianoKeys) {
		if (element.classList.contains('correct')) {
			return true;
		}
	}
	return false;
}

// Check current score against high score and reveal both to the player.
function checkHighScore() {
	const name = octaves.sort().toString();
	const record = JSON.parse(localStorage.getItem(siteName + name) || 0);
	detailsText.innerHTML = 'Your score: ' + score;
	detailsText.innerHTML += '<br>';
	detailsText.innerHTML += 'High score: ' + record;
	if (score > record) {
		localStorage.setItem(siteName + name, JSON.stringify(score));
	}
}

// Check the guess against the answer and update the UI accordingly.
function submitHandler(index) {
	if (answerRevealed()) return;
	playNote(noteFrequencies[answer['octave']][index]);
	const distance = Math.abs(index - answer['index']);
	pianoKeys[answer['index']].classList.add('correct');
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
	playNote(answer['freq']);
}

// Reset the score and start a new game with the same octaves.
function tryAgainHandler() {
	score = 0;
	tryAgainButton.classList.add('hidden');
	continueHandler();
}

// Add/remove the selected octave to/from the list of octaves to use.
function octaveClickHandler(index) {
	const element = octaveButtons[index];
	if (element.classList.contains('selected')) {
		element.classList.remove('selected');
		octaves.splice(octaves.indexOf(index + 1), 1);
	} else {
		element.classList.add('selected');
		octaves.push(index + 1);
	}
	startButton.disabled = octaves.length < 1;
}

// Add the click handler to the octave selectors.
function setOctaveHandlers() {
	for (let i = 0; i < octaveButtons.length; i += 1) {
		octaveButtons[i].addEventListener('click', () => octaveClickHandler(i));
	}
	JSON.parse(localStorage.getItem(siteName + 'Octaves') || '[4]')
			.forEach(item => octaveClickHandler(item - 1));
}

// Start the game with the selected octaves.
function startHandler() {
	localStorage.setItem(siteName + 'Octaves', JSON.stringify(octaves));
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
