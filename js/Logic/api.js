const BASE_URL = 'https://whispering-plateau-56641.herokuapp.com'

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
    .then(() => challengePlayer())
    .catch(error => {
      showAlertPopup('Your friend cannot play now...')
      setTimeout(() => hideAlertPopup(), 3000)
      throw error
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

function challengePlayer() {
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
    .then(opponentInfo => {
      const { contextID, playerID } = opponentInfo
      const body = { contextID, opponentID: playerID }
      return post('/v1/context/challenge', body)
    })
    .then(response => {
      if (!handleResponse(response)) throw 'Cannot Challenge Player'
    })
}

function rejectChallenge() {
  const contextRejected = challengeID
  const { playerID } = mockPlayerInfo
  const body = { playerID, contextRejected }

  return post('/v1/context/challenge/reject', body)
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

var challengeID = '0'
function subscribeGame() {
  const { contextID, playerID } = mockPlayerInfo
  const params = { contextID, playerID }

  return get('/v1/player/subscribe', params)
    .then(response => {
      const data = handleResponse(response)
      if (!data) throw 'Cannot Subscribe Game'
      return data
    })
    .then(data => {
      if (data.event === 'none') {
      } else if (data.event === 'challenge') {
        challengeID = data.challengeContext
        notifyChallenge()
      }

      return new Promise(resolve => setTimeout(resolve, 3000))
    })
    .then(() => subscribeGame())
}
