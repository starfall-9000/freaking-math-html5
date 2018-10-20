$(document).ready(function() {
  // app open
  initGame()
  syncPlayer()
  getPlayerLeaderboard()
  // subscribeGame()
  checkIsChallenge()
})

function initGame() {
  resetScore()
  randNum()
}
