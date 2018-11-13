function backupChoosePlayer() {
  return new Promise(resolve => {
    if (gameEnv === 'DEV') setTimeout(resolve, 1000)
    else FBInstant.context.chooseAsync().then(resolve)
  })
    .then(() => getPlayersAsync())
    .then(opponentInfo => getChallengeInfo(opponentInfo))
    .then(data => {
      const { status } = data

      if (!status || status === 'none' || status === 'rejected') {
        return data
      } else {
        throw status
      }
    })
    .then(data => challengePlayer(data))
    .catch(error => {
      setTimeout(() => {
        if (error === 'waited') {
          showAutoHideAlert('You have already challenged this player!')
        } else {
          showAutoHideAlert('Your friend cannot play now...')
        }
      }, 1000)
      throw 'Cannot play with this user, challenge status = ' + error
    })
}

function getPlayersAsync() {
  return new Promise(resolve => {
    if (gameEnv === 'DEV') resolve([mockPlayerInfo, mockOpponentInfo])
    else FBInstant.context.getPlayersAsync().then(resolve)
  }).then(listPlayers => {
    const playerID =
      gameEnv === 'DEV' ? mockPlayerInfo.playerID : FBInstant.player.getID()
    const filterList = listPlayers.filter(
      player => player.playerID !== playerID
    )
    return filterList[0]
  })
}

function getChallengeInfo(opponent) {
  const player = Player.currentPlayer()
  const { playerID } = player
  const { opponentID } = opponent
  const params = { playerID, opponentID }

  return get('/v2/context/challenge/info', params).then(response => {
    const data = handleResponse(response)
    if (!data) throw 'Cannot Get Challenge Info'
    if (data === true) return { playerID, opponentID, status: 'none' }
    return data
  })
}

function backupSyncChallengeData() {
  getPlayersAsync()
    .then(opponentInfo => getChallengeInfo(opponentInfo))
    .then(data => {
      if (data.opponentScore !== undefined && data.opponentScore !== null) {
        handleSyncVsModeGameOver({
          score: data.opponentScore,
          playerName: data.opponentName
        })
      }

      return data
    })
    .then(challengeInfo => updateChallengeInfo(challengeInfo))
    .catch(error => console.error(error))
}
