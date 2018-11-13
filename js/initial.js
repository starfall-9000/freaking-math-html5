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
  updatePlayerAvatar() // update current player avatar
  syncPlayer()
  getPlayerLeaderboard()
  subscribeGame()
  checkIsChallenge()
}
