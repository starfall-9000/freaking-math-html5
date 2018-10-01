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

function syncScoreData() {
  updatePlayerScore()
    .then(() => new Promise(resolve => setTimeout(resolve, 3000)))
    .then(() => getOpponentInfo())
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

function getOpponentInfo() {
  const { contextID, playerID } = mockPlayerInfo
  const params = { contextID, playerID }

  return get('/v1/context/opponent/info', params).then(response => {
    const data = handleResponse(response)
    if (!data) throw 'Cannot Get Opponent Info'
    return data
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
