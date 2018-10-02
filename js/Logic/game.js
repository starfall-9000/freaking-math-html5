var operators = ['+', '-']
var trueResult = 0
var showResult = 0
var turnBestScore = 0 // save best score in this game turn
var gameMode = 'single' // single | pvp | pvf
var gameReady = false

function playGame(type) {
  gameMode = type ? type : gameMode
  gameReady = true
  initGame()
  countDown(200)
}

var gameReady = false
function syncGamePlay(gameMode) {
  gameReady = false
  setTimeout(() => {
    if (!gameReady) showAlertPopup('Your opponent seem not to be ready...')
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
}

function randNum() {
  // random math: 2 number, operator and showResult
  // trueResult - 1 <= showResult <= trueResult + 1
  var num1 = Math.floor(Math.random() * 20 + 1)
  var num2 = Math.floor(Math.random() * 20 + 1)
  switch (operators[Math.floor(Math.random() * operators.length)]) {
    case '+':
      operator = '+'
      trueResult = num1 + num2
      showResult = trueResult - Math.floor(Math.random() * 2)
      break
    case '-':
      operator = '-'
      trueResult = num1 - num2
      showResult = trueResult + Math.floor(Math.random() * 2)
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
    countDown()
    randNum()
  } else {
    handleGameOver()
    updateTurnBestScore()
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
