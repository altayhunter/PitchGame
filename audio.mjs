import {
	noteNames,
	noteFrequencies,
} from './notes.mjs';

// DOM elements.
const pianoKeys = document.getElementsByClassName('pianoKey');

// Globals.
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const octaves = [];
const answer = {};

// Select a new random note and clear the guess input.
function chooseRandomNote() {
	const randomInt = (max) => max * Math.random() << 0;
	const octave = octaves[randomInt(octaves.length)];
	const index = randomInt(pianoKeys.length);
	answer['index'] = index;
	answer['octave'] = octave;
	resetPianoKeys();
}

// Audibly play the frequency for one second.
function playNote(frequency) {
	const duration = 1.0;
	const oscillator = audioCtx.createOscillator();
	oscillator.type = 'square';
	oscillator.frequency.value = frequency;
	const sweepEnv = audioCtx.createGain();
	sweepEnv.gain.setValueAtTime(0, audioCtx.currentTime);
	sweepEnv.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.1);
	sweepEnv.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration - 0.25);
	oscillator.connect(sweepEnv).connect(audioCtx.destination);
	oscillator.start();
	oscillator.stop(audioCtx.currentTime + duration);
}

// Play the frequency corresponding to the given piano key index.
function playIndex(index) {
	const octave = answer['octave'];
	playNote(noteFrequencies[octave][index]);
}

// Play the frequency corresponding to the correct answer.
function playAnswer() {
	playIndex(answer['index']);
}

// Place the piano keys in their default state, with none selected.
function resetPianoKeys() {
	for (const element of pianoKeys) {
		element.classList = 'pianoKey';
	}
}

// Highlight the piano key corresponding to the correct answer.
function highlightAnswer() {
	const index = answer['index'];
	pianoKeys[index].classList.add('correct');
}

// Return the distance in half-notes from the correct answer.
function answerDistance(index) {
	const distance = Math.abs(index - answer['index']);
	if (distance === 11) return 1;
	return distance;
}

// Add an octave if it's missing, or remove it if it already exists.
function toggleOctave(octave) {
	if (octaves.includes(octave)) {
		octaves.splice(octaves.indexOf(octave), 1);
	} else {
		octaves.push(octave);
	}
}

// Return whether one or more octaves have been selected.
function octavesSelected() {
	return octaves.length > 0;
}

// Return a reference to the octaves array.
function getOctaves() {
	return octaves;
}

export {
	answerDistance,
	chooseRandomNote,
	getOctaves,
	highlightAnswer,
	octavesSelected,
	playAnswer,
	playIndex,
	toggleOctave,
}
