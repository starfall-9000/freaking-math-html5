if (gameEnv === 'DEV') {
  $(document).ready(function() {
    setupGame()
  })
} else {
  FBInstant.initializeAsync().then(function() {
    FBInstant.setLoadingProgress(100)
    FBInstant.startGameAsync().then(function() {
      setupGame()
    })
  })
}

function setupGame() {
  // app open
  initGame()
  syncPlayer()
  getPlayerLeaderboard()
  // subscribeGame()
  checkIsChallenge()
}

function initGame() {
  resetScore()
  randNum()
}
