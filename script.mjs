import {
	noteFrequencies,
} from './noteFrequencies.mjs';

const playButton = document.querySelector('#play');
const guessText = document.querySelector('#guess');
const submitButton = document.querySelector('#submit');

let answer = {};

// Select a new random note and clear the guess input.
function chooseRandomNote() {
	const randomKey = (obj) => {
		const keys = Object.keys(obj);
		return keys[keys.length * Math.random() << 0];
	};
	answer['note'] = randomKey(noteFrequencies);
	answer['freq'] = noteFrequencies[answer['note']];
	guessText.value = '';
}

// Audibly play the frequency for half a second.
function playHandler() {
	const duration = 500;
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	const oscillator = audioCtx.createOscillator();
	oscillator.type = 'square';
	oscillator.frequency.value = answer['freq'];
	oscillator.connect(audioCtx.destination);
	oscillator.start();
	setTimeout(() => {
		oscillator.stop();
	}, duration);
}

// Convert note to uppercase and replace flat with sharp.
function normalizeNote(note) {
	note = note.toUpperCase();
	if (note[1] !== 'B') return note;
	switch(note[0]) {
		case 'A': return 'G#' + note[2];
		case 'B': return 'A#' + note[2];
		case 'C': return 'B#' + note[2];
		case 'D': return 'C#' + note[2];
		case 'E': return 'D#' + note[2];
		case 'F': return 'E#' + note[2];
		case 'G': return 'F#' + note[2];
		default: return note;
	}
}

// Look up the frequency of the note, logging any errors.
function noteFrequency(note) {
	note = normalizeNote(note);
	if (!/[A-G]#?[0-8]/.test(note)) {
		console.log('Invalid format for note:', note);
		return undefined;
	} else {
		return noteFrequencies[note];
	}
}

// Check the answer and display the result in a popup box.
function submitHandler() {
	const guess = noteFrequency(guessText.value);
	if (guess === answer['freq']) {
		alert('Correct!');
	} else {
		alert('Incorrect. The note was ' + answer['note']);
	}
	chooseRandomNote();
}

playButton.onclick = playHandler;
submitButton.onclick = submitHandler;
chooseRandomNote();
