const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');

const playBtn = document.getElementById('play-btn');
const platformOptions = document.getElementById('platform-options');
const btnPc = document.getElementById('btn-pc');
const btnMobile = document.getElementById('btn-mobile');
const closeBtn = document.getElementById('close-btn');

const pauseBtn = document.getElementById('pause-btn');
const pauseMenu = document.getElementById('pause-menu');
const resumeBtn = document.getElementById('resume-btn');
const restartBtn = document.getElementById('restart-btn');
const soundBtn = document.getElementById('sound-btn');
const homeBtn = document.getElementById('home-btn');

let selectedPlatform = null;
let gamePaused = false;

playBtn.addEventListener('click', () => {
  platformOptions.classList.toggle('hidden');
});

btnPc.addEventListener('click', () => {
  selectedPlatform = 'pc';
  startGame();
});

btnMobile.addEventListener('click', () => {
  selectedPlatform = 'mobile';
  startGame();
});

closeBtn.addEventListener('click', () => {
  window.close();
});

function startGame() {
  mainMenu.classList.remove('active');
  gameScreen.classList.add('active');
  platformOptions.classList.add('hidden');

  window.dispatchEvent(new CustomEvent('game:start', {
    detail: { platform: selectedPlatform }
  }));
}

pauseBtn.addEventListener('click', () => {
  togglePause(true);
});

resumeBtn.addEventListener('click', () => {
  togglePause(false);
});

homeBtn.addEventListener('click', () => {
  togglePause(false);
  gameScreen.classList.remove('active');
  mainMenu.classList.add('active');
  window.dispatchEvent(new CustomEvent('game:returnToMenu'));
});

restartBtn.addEventListener('click', () => {
  togglePause(false);
  window.dispatchEvent(new CustomEvent('game:restart'));
});

soundBtn.addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('game:toggleSound'));
});

function togglePause(state) {
  gamePaused = state;
  pauseMenu.classList.toggle('hidden', !state);
  window.dispatchEvent(new CustomEvent('game:pauseState', {
    detail: { paused: state }
  }));
}