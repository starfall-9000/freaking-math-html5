$(document).ready(function() {
  // app open
  initGame()
  getPlayerInfo()
})

function initGame() {
  resetScore()
  randNum()
}

function getPlayerInfo() {
  updatePlayerAvatar(mockPlayerInfo)
}
