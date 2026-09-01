const GameTimer = (() => {
  const TURN_DURATION = 30;
  const TURNS_PER_WAVE = 2;
  const TOTAL_WAVES = 5;
  const TURN_TYPES = ['diurno', 'noturno'];

  let currentWave = 1;
  let currentTurnIndex = 0;
  let timeRemaining = TURN_DURATION;
  let timerInterval = null;
  let isRunning = false;
  let isPaused = false;

  function getCurrentTurnType() {
    return TURN_TYPES[currentTurnIndex];
  }

  function getTotalElapsedSeconds() {
    const completedWaves = currentWave - 1;
    const completedTurnsInCurrentWave = currentTurnIndex;
    const secondsFromCompletedWaves = completedWaves * TURNS_PER_WAVE * TURN_DURATION;
    const secondsFromCompletedTurns = completedTurnsInCurrentWave * TURN_DURATION;
    const secondsFromCurrentTurn = TURN_DURATION - timeRemaining;
    return secondsFromCompletedWaves + secondsFromCompletedTurns + secondsFromCurrentTurn;
  }

  function getTotalGameDuration() {
    return TOTAL_WAVES * TURNS_PER_WAVE * TURN_DURATION;
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    isPaused = false;
    currentWave = 1;
    currentTurnIndex = 0;
    timeRemaining = TURN_DURATION;

    dispatchWaveStart();
    dispatchTurnStart();

    timerInterval = setInterval(tick, 1000);
  }

  function tick() {
    if (isPaused) return;

    timeRemaining--;

    dispatchTick();

    if (timeRemaining <= 0) {
      advanceTurn();
    }
  }

  function advanceTurn() {
    dispatchTurnEnd();

    currentTurnIndex++;

    if (currentTurnIndex >= TURNS_PER_WAVE) {
      currentTurnIndex = 0;
      dispatchWaveEnd();
      currentWave++;

      if (currentWave > TOTAL_WAVES) {
        finishGame();
        return;
      }

      dispatchWaveStart();
    }

    timeRemaining = TURN_DURATION;
    dispatchTurnStart();
  }

  function finishGame() {
    stop();
    window.dispatchEvent(new CustomEvent('timer:gameComplete', {
      detail: {
        totalWaves: TOTAL_WAVES,
        totalDuration: getTotalGameDuration()
      }
    }));
  }

  function pause() {
    isPaused = true;
    window.dispatchEvent(new CustomEvent('timer:paused'));
  }

  function resume() {
    isPaused = false;
    window.dispatchEvent(new CustomEvent('timer:resumed'));
  }

  function stop() {
    isRunning = false;
    isPaused = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function reset() {
    stop();
    currentWave = 1;
    currentTurnIndex = 0;
    timeRemaining = TURN_DURATION;
  }

  function dispatchTick() {
    window.dispatchEvent(new CustomEvent('timer:tick', {
      detail: {
        wave: currentWave,
        turnType: getCurrentTurnType(),
        turnIndex: currentTurnIndex,
        timeRemaining: timeRemaining,
        turnDuration: TURN_DURATION,
        totalElapsed: getTotalElapsedSeconds(),
        totalDuration: getTotalGameDuration()
      }
    }));
  }

  function dispatchTurnStart() {
    window.dispatchEvent(new CustomEvent('timer:turnStart', {
      detail: {
        wave: currentWave,
        turnType: getCurrentTurnType(),
        turnIndex: currentTurnIndex,
        timeRemaining: timeRemaining
      }
    }));
  }

  function dispatchTurnEnd() {
    window.dispatchEvent(new CustomEvent('timer:turnEnd', {
      detail: {
        wave: currentWave,
        turnType: getCurrentTurnType(),
        turnIndex: currentTurnIndex
      }
    }));
  }

  function dispatchWaveStart() {
    window.dispatchEvent(new CustomEvent('timer:waveStart', {
      detail: {
        wave: currentWave,
        totalWaves: TOTAL_WAVES
      }
    }));
  }

  function dispatchWaveEnd() {
    window.dispatchEvent(new CustomEvent('timer:waveEnd', {
      detail: {
        wave: currentWave,
        totalWaves: TOTAL_WAVES
      }
    }));
  }

  window.addEventListener('game:pauseState', (e) => {
    if (e.detail.paused) {
      pause();
    } else {
      resume();
    }
  });

  window.addEventListener('game:restart', () => {
    reset();
    start();
  });

  window.addEventListener('game:returnToMenu', () => {
    stop();
  });

  window.addEventListener('game:start', () => {
    start();
  });

  return {
    start,
    pause,
    resume,
    stop,
    reset,
    getCurrentWave: () => currentWave,
    getCurrentTurnType,
    getTimeRemaining: () => timeRemaining,
    getTotalElapsedSeconds,
    getTotalGameDuration,
    isRunning: () => isRunning,
    isPaused: () => isPaused,
    TURN_DURATION,
    TURNS_PER_WAVE,
    TOTAL_WAVES
  };
})();