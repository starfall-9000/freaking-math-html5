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
  renderListLeaderboard(mockLeaderboard)
}

function updateLeaderboard() {
  getPlayerLeaderboard()
}

function getPlayerLeaderboard() {
  updateBestScore(mockPlayerInfo)
}

function matchPlayer() {
  return new Promise(resolve => setTimeout(resolve, 1000))
}

function choosePlayer() {
  return new Promise(resolve => setTimeout(resolve, 1000))
    .then(() => console.log('need to call challenge api'))
    .catch(error => {
      setTimeout(() => {
        showAutoHideAlert('Your friend cannot play now...')
      }, 1000)
      throw 'Cannot play with this user, challenge status = ' + error
    })
}

function backupChoosePlayer() {
  return new Promise(resolve => setTimeout(resolve, 1000))
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
  return new Promise(resolve => setTimeout(resolve, 100))
    .then(() => {
      return [mockPlayerInfo, mockOpponentInfo]
    })
    .then(listPlayers => {
      const filterList = listPlayers.filter(
        player => player.playerID !== mockPlayerInfo.playerID
      )
      return filterList[0]
    })
}

function switchContext() {
  return new Promise(resolve => setTimeout(resolve, 1000))
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
  const { contextID, playerID } = mockPlayerInfo
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
  const { contextID, playerID } = mockPlayerInfo
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
  const { playerID } = mockPlayerInfo
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
  updatePlayerAvatar(mockPlayerInfo)

  const { playerID, playerName, avatar, bestScore } = mockPlayerInfo
  const body = { playerID, playerName, avatar, bestScore }

  return post('/v1/player/sync', body)
    .then(response => {
      if (!handleResponse(response)) throw 'Cannot Sync Player'
    })
    .catch(error => console.error(error))
}

function updateGameStatus(isReady = true) {
  const { contextID, playerID } = mockPlayerInfo
  const body = { contextID, playerID, isReady }

  return post('/v1/context/ready', body).then(response => {
    if (!handleResponse(response)) throw 'Cannot Update Game Status'
  })
}

function subscribeGame() {
  const { contextID, playerID } = mockPlayerInfo
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
  const { playerID } = mockPlayerInfo
  const opponentID = opponentInfo.playerID
  const params = { playerID, opponentID }

  return get('/v2/context/challenge/info', params).then(response => {
    const data = handleResponse(response)
    if (!data) throw 'Cannot Get Challenge Info'
    if (data === true) return { playerID, opponentID, status: 'none' }
    return data
  })
}

function syncChallengeData() {
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

function shareChallenge() {
  const { contextID, playerID, playerName, avatar } = mockPlayerInfo
  const score = parseInt($('#score').text())
  convertBase64Image('./images/logo.png')
    .then(base64Picture => {
      const updateContent = {
        action: 'CUSTOM',
        cta: 'Got Challenge',
        image: base64Picture,
        text: {
          default: playerName + ' just challenged you!'
        },
        template: 'challenge_mode',
        data: { contextID, playerID, playerName, avatar, score },
        strategy: 'IMMEDIATE_CLEAR',
        notification: 'PUSH'
      }

      console.log(updateContent)
      console.log('need to call api syncChallengeData')
      showScreen('.home-screen')
    })
    .catch(error => console.error(error))
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
