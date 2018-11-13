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

function updatePlayerScore() {
  const player = Player.currentPlayer()
  const { score, contextID, playerID } = player
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
  const player = Player.currentPlayer()
  const { contextID, playerID } = player
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
  const player = Player.currentPlayer()
  const { playerID, playerName, avatar, bestScore } = player
  const body = { playerID, playerName, avatar, bestScore }

  return post('/v1/player/sync', body)
    .then(response => {
      if (!handleResponse(response)) throw 'Cannot Sync Player'
    })
    .catch(error => console.error(error))
}

function updateGameStatus(isReady = true) {
  const player = Player.currentPlayer()
  const { contextID, playerID } = player
  const body = { contextID, playerID, isReady }

  return post('/v1/context/ready', body).then(response => {
    if (!handleResponse(response)) throw 'Cannot Update Game Status'
  })
}

function subscribeGame() {
  const player = Player.currentPlayer()
  const { contextID, playerID } = player
  const params = { contextID, playerID }

  const game = Game.currentGame()
  console.log('Subscribe Game:')
  console.log(game.config)

  // if (gameStatus !== 'FREE') {
  return new Promise(resolve => setTimeout(resolve, 3000)).then(() =>
    subscribeGame()
  )
  // }

  // return get('/v2/player/subscribe', params)
  //   .then(response => {
  //     const data = handleResponse(response)
  //     if (!data) throw 'Cannot Subscribe Game'
  //     return data
  //   })
  //   .then(data => {
  //     if (data.event === 'none') {
  //     } else if (data.event === 'challenge') {
  //       saveChallengeInfo = data
  //       notifyChallenge()
  //     }

  //     return new Promise(resolve => setTimeout(resolve, 3000))
  //   })
  //   .then(() => subscribeGame())
}

function syncChallengeData() {
  const game = Game.currentGame()
  const opponent = game.gameInfo.player2
  handleSyncVsModeGameOver(opponent)
  shareChallenge(opponent)
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

function shareChallenge(opponent) {
  const player = Player.currentPlayer()
  const { contextID, playerID, playerName, avatar, score } = player
  const msg = getChallengeMsg(opponent)

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
      const game = Game.currentGame()
      game.setConfig({ gameStatus: 'FREE' })
      if (gameEnv === 'DEV') showScreen('.home-screen')
      else if (!opponentInfo) FBInstant.quit()
    })
    .catch(error => console.error(error))
}

function getChallengeMsg(opponent) {
  const player = Player.currentPlayer()
  const { playerName, score } = player

  let msg = playerName + ' just challenged you!'
  if (opponent) {
    const opponentName = opponent.playerName
    const opponentScore = opponent.score

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
