const BASE_URL = 'https://whispering-plateau-56641.herokuapp.com'
var saveChallengeInfo = {}

function url(path) {
  return BASE_URL + path
}

async function request(method, path, data) {
  const request = await $.ajax({
    type: method,
    headers: {
      'Content-Type': 'application/json',
      charset: 'UTF-8'
    },
    url: url(path),
    data: data
  })

  return request
}

function post(path, body) {
  return request('POST', path, JSON.stringify(body))
}

function get(path, params) {
  return request('GET', path, params)
}

function handleResponse(response) {
  if (response.code === '200') {
    if (response.data) return response.data
    else return true
  } else {
    console.log(response.msg)
    return false
  }
}

function getLeaderboard() {
  if (gameEnv === 'DEV') {
    renderListLeaderboard(mockLeaderboard)
  } else {
    FBInstant.getLeaderboardAsync('freaking_math_score')
      .then(leaderboard => leaderboard.getEntriesAsync(7, 0))
      .then(entries => renderListLeaderboard(entries))
      .catch(error => console.error(error))
  }
}

function updateLeaderboard() {
  if (gameEnv === 'DEV') getPlayerLeaderboard()
  else {
    const score = parseInt($('#score').text())
    var contextId = FBInstant.context.getID()

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
        updateBestScore({ bestScore: entry.getScore() })
      })
      .catch(error => console.error(error))
  }
}

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

function switchContext() {
  return new Promise(resolve => {
    if (gameEnv === 'DEV') setTimeout(resolve, 1000)
    else FBInstant.context.switchAsync(challengeID).then(resolve)
  })
}

function syncScoreData() {
  setTimeoutGetOpponentInfo()
  updatePlayerScore()
    .then(() => new Promise(resolve => setTimeout(resolve, 3000)))
    .then(() => getOpponentInfo('SYNC_SCORE'))
    .then(data => handleSyncVsModeGameOver(data))
    .catch(error => console.error(error))
}

function updatePlayerScore() {
  const score = parseInt($('#score').text())
  let contextID, playerID
  if (gameEnv === 'DEV') {
    contextID = mockPlayerInfo.contextID
    playerID = mockPlayerInfo.playerID
  } else {
    contextID = FBInstant.context.getID()
    playerID = FBInstant.player.getID()
  }
  const body = { contextID, playerID, score }

  return post('/v1/context/end', body).then(response => {
    if (!handleResponse(response)) throw 'Cannot Update Player Score'
  })
}

var isWaiting = 0
function setTimeoutGetOpponentInfo() {
  isWaiting = isWaiting + 1
  setTimeout(() => {
    isWaiting = isWaiting - 1
  }, 15000)
}

function getOpponentInfo(type = 'SYNC_PLAYER') {
  // type = SYNC_PLAYER | SYNC_SCORE
  let contextID, playerID
  if (gameEnv === 'DEV') {
    contextID = mockPlayerInfo.contextID
    playerID = mockPlayerInfo.playerID
  } else {
    contextID = FBInstant.context.getID()
    playerID = FBInstant.player.getID()
  }
  const params = { contextID, playerID }

  return get('/v1/context/opponent/info', params)
    .then(response => {
      const data = handleResponse(response)
      if (!data) throw 'Cannot Get Opponent Info'
      if (data === true) {
        const timeOut = type === 'SYNC_PLAYER' ? 1000 : 3000
        return new Promise(resolve => setTimeout(resolve, timeOut))
      }
      // return data
      return data
    })
    .then(data => {
      if (!isWaiting) {
        throw 'Cannot Connect To Opponent'
      }
      if (type === 'SYNC_PLAYER') {
        if (!data || data.isReady === false) return getOpponentInfo(type)
        else return data
      } else {
        if (!data || data.score === undefined || data.score === null)
          return getOpponentInfo(type)
        else return data
      }
    })
}

function challengePlayer(challengeInfo) {
  const { playerId, opponentId } = challengeInfo

  const body = { playerID: playerId, opponentID: opponentId }
  return post('/v2/context/challenge', body).then(response => {
    if (!handleResponse(response)) throw 'Cannot Challenge Player'
  })
}

function rejectChallenge() {
  const { opponentID } = saveChallengeInfo
  const playerID =
    gameEnv === 'DEV' ? mockPlayerInfo.playerID : FBInstant.player.getID()
  const body = { playerID, opponentID }

  return post('/v2/context/challenge/reject', body)
    .then(response => {
      if (!handleResponse(response)) throw 'Cannot Reject Challenge'
    })
    .catch(error => {
      console.log('Error when reject challenge: ' + error)
    })
}

function syncPlayer() {
  if (gameEnv === 'DEV') {
    updatePlayerAvatar(mockPlayerInfo)
  } else {
    updatePlayerAvatar({ avatar: FBInstant.player.getPhoto() })
  }

  let playerID, playerName, avatar, bestScore
  if (gameEnv === 'DEV') {
    playerID = mockPlayerInfo.playerID
    playerName = mockPlayerInfo.playerName
    avatar = mockPlayerInfo.avatar
    bestScore = mockPlayerInfo.bestScore
  } else {
    playerID = FBInstant.player.getID()
    playerName = FBInstant.player.getName()
    avatar = FBInstant.player.getPhoto()
    bestScore = 0
  }
  const body = { playerID, playerName, avatar, bestScore }

  return post('/v1/player/sync', body)
    .then(response => {
      if (!handleResponse(response)) throw 'Cannot Sync Player'
    })
    .catch(error => console.error(error))
}

function updateGameStatus(isReady = true) {
  let contextID, playerID
  if (gameEnv === 'DEV') {
    contextID = mockPlayerInfo.contextID
    playerID = mockPlayerInfo.playerID
  } else {
    contextID = FBInstant.context.getID()
    playerID = FBInstant.player.getID()
  }
  const body = { contextID, playerID, isReady }

  return post('/v1/context/ready', body).then(response => {
    if (!handleResponse(response)) throw 'Cannot Update Game Status'
  })
}

function subscribeGame() {
  const contextID =
    gameEnv === 'DEV' ? mockPlayerInfo.contextID : FBInstant.context.getID()
  const playerID =
    gameEnv === 'DEV' ? mockPlayerInfo.playerID : FBInstant.player.getID()
  const params = { contextID, playerID }

  if (gameStatus !== 'FREE') {
    return new Promise(resolve => setTimeout(resolve, 3000)).then(() =>
      subscribeGame()
    )
  }

  return get('/v2/player/subscribe', params)
    .then(response => {
      const data = handleResponse(response)
      if (!data) throw 'Cannot Subscribe Game'
      return data
    })
    .then(data => {
      if (data.event === 'none') {
      } else if (data.event === 'challenge') {
        saveChallengeInfo = data
        notifyChallenge()
      }

      return new Promise(resolve => setTimeout(resolve, 3000))
    })
    .then(() => subscribeGame())
}

function getChallengeInfo(opponentInfo) {
  const playerID =
    gameEnv === 'DEV' ? mockPlayerInfo.playerID : FBInstant.player.getID()
  const opponentID =
    gameEnv === 'DEV' ? opponentInfo.playerID : opponentInfo.getID()
  const params = { playerID, opponentID }

  return get('/v2/context/challenge/info', params).then(response => {
    const data = handleResponse(response)
    if (!data) throw 'Cannot Get Challenge Info'
    if (data === true) return { playerID, opponentID, status: 'none' }
    return data
  })
}

function syncChallengeData() {
  const entryPointData =
    gameEnv === 'DEV' ? mockOpponentInfo : FBInstant.getEntryPointData()
  const { score, playerName } = entryPointData
  const opponentInfo = { score, playerName }
  handleSyncVsModeGameOver(opponentInfo)

  shareChallenge(entryPointData)
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

function updateChallengeInfo(challengeInfo) {
  const playerID = challengeInfo.playerId
  const opponentID = challengeInfo.opponentId
  const score = parseInt($('#score').text())
  const opponentScore = challengeInfo.opponentScore

  const body = { playerID, opponentID, score, opponentScore }

  return post('/v2/context/challenge/end', body).then(response => {
    if (!handleResponse(response)) throw 'Cannot Update Game Status'
  })
}

function shareChallenge(opponentInfo) {
  const contextID =
    gameEnv === 'DEV' ? mockPlayerInfo.contextID : FBInstant.context.getID()
  const playerID =
    gameEnv === 'DEV' ? mockPlayerInfo.playerID : FBInstant.player.getID()
  const playerName =
    gameEnv === 'DEV' ? mockPlayerInfo.playerName : FBInstant.player.getName()
  const avatar =
    gameEnv === 'DEV' ? mockPlayerInfo.avatar : FBInstant.player.getPhoto()
  const score = parseInt($('#score').text())
  const msg = getChallengeMsg(opponentInfo)

  convertBase64Image('./images/logo.png')
    .then(base64Picture => {
      const updateContent = {
        action: 'CUSTOM',
        cta: 'Got Challenge',
        image: base64Picture,
        text: {
          default: msg
        },
        template: 'challenge_mode',
        data: { contextID, playerID, playerName, avatar, score },
        strategy: 'IMMEDIATE_CLEAR',
        notification: 'PUSH'
      }

      console.log('need to call api syncChallengeData')
      if (gameEnv === 'DEV') {
        console.log(updateContent)
      } else {
        return FBInstant.updateAsync(updateContent)
      }
    })
    .then(() => {
      if (gameEnv === 'DEV') showScreen('.home-screen')
      else if (!opponentInfo) FBInstant.quit()
    })
    .catch(error => console.error(error))
}

function getChallengeMsg(opponentInfo) {
  const playerName =
    gameEnv === 'DEV' ? mockPlayerInfo.playerName : FBInstant.player.getName()
  const score = parseInt($('#score').text())

  let msg = playerName + ' just challenged you!'
  if (opponentInfo) {
    const opponentName = opponentInfo.playerName
    const opponentScore = opponentInfo.score

    const winner = score > opponentScore ? playerName : opponentName
    const loser = score > opponentScore ? opponentName : playerName
    const winnerScore = score > opponentScore ? score : opponentScore
    const loserScore = score > opponentScore ? opponentScore : score
    const result = winnerScore + ' - ' + loserScore
    msg = winner + ' beat ' + loser + ': ' + result

    if (score === opponentScore) {
      msg = 'You got a draw match: ' + score + ' - ' + score
    }
  }

  return msg
}

function convertBase64Image(imagePath) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', imagePath, true)
    xhr.responseType = 'blob'
    xhr.send()
    xhr.onload = event => resolve(xhr, event)
  })
    .then((xhr, event) => {
      return new Promise((resolve, reject) => {
        var reader = new FileReader()
        var file = xhr.response
        reader.readAsDataURL(file)
        reader.onload = event => resolve(event)
      })
    })
    .then(event => event.target.result)
}
