$(document).ready(function() {
  // app open
  initGame()
  getPlayerInfo()
  getPlayerLeaderboard()
})

function initGame() {
  resetScore()
  randNum()
}

function getPlayerInfo() {
  updatePlayerAvatar(mockPlayerInfo)
}
