var operators = ['+', '-']
var trueResult = 0
var showResult = 0
var turnBestScore = 0 // save best score in this game turn
var gameMode = 'single' // single | pvp | pvf
var gameStatus = 'FREE' // FREE | PLAYED | CHALLENGED | WAITING

function playGame(type) {
  gameMode = type ? type : gameMode
  gameStatus = 'PLAYED'
  initGame()
  countDown()
}

function syncGamePlay(gameMode) {
  gameStatus = 'WAITING'
  setTimeout(() => {
    if (gameStatus === 'WAITING') {
      showAlertPopup('Your opponent seem not to be ready...')
    }
  }, 7000)
  setTimeoutGetOpponentInfo()

  return updateGameStatus(true)
    .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
    .then(() => getOpponentInfo('SYNC_PLAYER'))
    .then(opponentInfo => {
      hideAlertPopup()
      showScreen('.pre-match-screen')
      const currentInfo = mockPlayerInfo
      updatePreMatchInfo(currentInfo, opponentInfo)
    })
    .then(() => new Promise(resolve => setTimeout(resolve, 2000)))
    .then(() => {
      showScreen('.main-screen')
      playGame(gameMode)
    })
    .catch(error => {
      gameStatus = 'FREE'
      hideAlertPopup()
      throw error
    })
}

function syncGamePlayPVF(gameMode = 'pvf') {
  gameStatus = 'WAITING'
  showScreen('.main-screen')
  playGame(gameMode)

  // gameStatus = 'FREE'
  // hideAlertPopup()
}

function notifyChallenge() {
  if (gameStatus === 'FREE') {
    gameStatus = 'CHALLENGED'
    showChallengePopup()
  }
}

function randNum() {
  // random math: 2 number, operator and showResult
  // trueResult - num3 <= showResult <= trueResult + num3

  const score = parseInt($('#score').text())
  const range = score < 5 ? 9 : 20 // if score < 5, easier logic, with 1 number

  var num1 = Math.floor(Math.random() * range + 1)
  var num2 = Math.floor(Math.random() * range + 1)
  const num3 = Math.floor(Math.random() * 5 + 1)

  switch (operators[Math.floor(Math.random() * operators.length)]) {
    case '+':
      operator = '+'
      trueResult = num1 + num2
      showResult = trueResult - Math.floor(Math.random() * 2) * num3
      break
    case '-':
      operator = '-'
      trueResult = num1 - num2
      showResult = trueResult + Math.floor(Math.random() * 2) * num3
      break
  }

  // show random number to web
  showRandowNumber(operator, num1, num2, showResult)
}

function check(arg) {
  // check the result
  if (
    (arg == 'true' && trueResult == showResult) ||
    (arg != 'true' && trueResult != showResult)
  ) {
    updateScore()
    randNum()

    $('.main-screen').attr('id', 'flash-green')
    setTimeout(() => {
      $('.main-screen').attr('id', 'flash-none')
    }, 70)
  } else {
    randNum()

    $('.main-screen').attr('id', 'flash-red')
    setTimeout(() => {
      $('.main-screen').attr('id', 'flash-none')
    }, 70)
  }
}

function updateTurnBestScore() {
  // update best score in this game turn
  // update async leaderboard only when turn best score is new
  const score = parseInt($('#score').text())

  if (turnBestScore < score) {
    turnBestScore = score
    updateLeaderboard()
  }
}

function checkIsChallenge() {
  const contextType = 'THREAD'
  const { playerID } = mockPlayerInfo
  const opponentID = mockOpponentInfo.playerID

  if (contextType === 'THREAD' && playerID !== opponentID) {
    showScreen('.main-screen')
    playGame('fvp')
  }
}
