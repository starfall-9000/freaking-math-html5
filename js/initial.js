$(document).ready(function() {
  // need to setup enviroment
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
