// Index-to-name mappings for noteFrequencies values.
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Frequencies in Hz using even temperament and A440 tuning.
const noteFrequencies = [
	[16.35160, 17.32391, 18.35405, 19.44544, 20.60172, 21.82676, 23.12465, 24.49971, 25.95654, 27.50000, 29.13524, 30.86771],
	[32.70320, 34.64783, 36.70810, 38.89087, 41.20344, 43.65353, 46.24930, 48.99943, 51.91309, 55.00000, 58.27047, 61.73541],
	[65.40639, 69.29566, 73.41619, 77.78175, 82.40689, 87.30706, 92.49861, 97.99886, 103.8262, 110.0000, 116.5409, 123.4708],
	[130.8128, 138.5913, 146.8324, 155.5635, 164.8138, 174.6141, 184.9972, 195.9977, 207.6523, 220.0000, 233.0819, 246.9417],
	[261.6256, 277.1826, 293.6648, 311.1270, 329.6276, 349.2282, 369.9944, 391.9954, 415.3047, 440.0000, 466.1638, 493.8833],
	[523.2511, 554.3653, 587.3295, 622.2540, 659.2551, 698.4565, 739.9888, 783.9909, 830.6094, 880.0000, 932.3275, 987.7666],
	[1046.502, 1108.731, 1174.659, 1244.508, 1318.510, 1396.913, 1479.978, 1567.982, 1661.219, 1760.000, 1864.655, 1975.533],
	[2093.005, 2217.461, 2349.318, 2489.016, 2637.020, 2793.826, 2959.955, 3135.963, 3322.438, 3520.000, 3729.310, 3951.066],
	[4186.009, 4434.922, 4698.636, 4978.032, 5274.041, 5587.652, 5919.911, 6271.927, 6644.875, 7040.000, 7458.620, 7902.133],
];

// AudioContext for the oscillators.
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Audibly play the frequency for one second.
function playFrequency(frequency) {
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
function playNote(index, octave) {
	playFrequency(noteFrequencies[octave][index]);
}

export {
	playNote,
}
