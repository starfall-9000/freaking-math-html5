function getLeaderboard() {
  renderListLeaderboard(mockLeaderboard)
}

function updateLeaderboard() {
  getPlayerLeaderboard()
}

function getPlayerLeaderboard() {
  updateBestScore(mockPlayerInfo)
}

function syncScoreData() {
  handleSyncVsModeGameOver(mockOpponentInfo)
}
