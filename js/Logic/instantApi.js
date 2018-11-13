function matchPlayer() {
  if (gameEnv === 'DEV') {
    return new Promise(resolve => setTimeout(resolve, 1000))
  } else {
    return FBInstant.matchPlayerAsync(null, true)
  }
}

function choosePlayer() {
  return new Promise(resolve => {
    if (gameEnv === 'DEV') setTimeout(resolve, 1000)
    else FBInstant.context.chooseAsync().then(resolve)
  })
    .then(() => console.log('need to call challenge api'))
    .catch(error => {
      setTimeout(() => {
        showAutoHideAlert('Your friend cannot play now...')
      }, 1000)
      throw 'Cannot play with this user, challenge status = ' + error
    })
}

function switchContext() {
  return new Promise(resolve => {
    if (gameEnv === 'DEV') setTimeout(resolve, 1000)
    else FBInstant.context.switchAsync(challengeID).then(resolve)
  })
}

function getLeaderboard() {
  if (gameEnv === 'DEV') {
    renderListLeaderboard(mockLeaderboard)
  } else {
    FBInstant.getLeaderboardAsync('freaking_math_score')
      .then(leaderboard => leaderboard.getEntriesAsync(7, 0))
      .then(entries => renderListLeaderboard(entries)) // warning: need to be called from object
      .catch(error => console.error(error))
  }
}

function updateLeaderboard() {
  if (gameEnv === 'DEV') getPlayerLeaderboard()
  else {
    const player = Player.currentPlayer()
    const { score, contextID } = player

    FBInstant.getLeaderboardAsync('freaking_math_score')
      .then(leaderboard => {
        return leaderboard.setScoreAsync(score)
      })
      .then(() => getPlayerLeaderboard())
      .catch(error => console.error(error))
  }
}

function getPlayerLeaderboard() {
  if (gameEnv === 'DEV') {
    updateBestScore(mockPlayerInfo)
  } else {
    FBInstant.getLeaderboardAsync('freaking_math_score')
      .then(leaderboard => leaderboard.getPlayerEntryAsync())
      .then(entry => {
        console.log('Log Player Entry Async api')
        console.log(entry)
        updateBestScore({ bestScore: entry.getScore() }) // warning: need to be called from object
      })
      .catch(error => console.error(error))
  }
}
