$(document).ready(function() {
  // app open
  initGame()
  syncPlayer()
  getPlayerLeaderboard()
  subscribeGame()
})

function initGame() {
  resetScore()
  randNum()
}
