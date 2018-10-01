$(document).ready(function() {
  // app open
  initGame()
  syncPlayer()
  getPlayerLeaderboard()
})

function initGame() {
  resetScore()
  randNum()
}
