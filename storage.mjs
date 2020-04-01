// Globals.
const siteName = 'pitch';
const octaveKey = siteName + 'Octaves';
let scoreKey;

// Return the last stored high score. Must be called after storeOctaves.
function retrieveHighScore() {
	return JSON.parse(localStorage.getItem(scoreKey) || 0);
}

// Return the last stored array of octaves.
function retrieveOctaves() {
	return JSON.parse(localStorage.getItem(octaveKey) || '[4]')
}

// Store the given high score.
function storeHighScore(score) {
	localStorage.setItem(scoreKey, JSON.stringify(score));
}

// Store the selected octaves, and the key for the high score.
function storeOctaves(octaves) {
	scoreKey = siteName + octaves.sort().toString();
	localStorage.setItem(octaveKey, JSON.stringify(octaves));
}

export {
	retrieveHighScore,
	retrieveOctaves,
	storeHighScore,
	storeOctaves,
}
