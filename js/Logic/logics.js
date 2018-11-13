// need to setup enviroment

function initGame() {
  resetScore()
  randNum()
}

function playGame(type) {
  const game = Game.currentGame()
  game.setConfig({ gameMode: type, gameStatus: 'PLAYED' })
  initGame()
  countDown()
}

function syncGamePlay(gameMode) {
  const game = Game.currentGame()
  game.setConfig({ gameStatus: 'WAITING' })

  setTimeout(() => {
    if (game.config.gameStatus === 'WAITING') {
      showAlertPopup('Your opponent seem not to be ready...')
    }
  }, 7000)

  const player = Player.currentPlayer()
  const opponent = Game.currentGame().player2
  setTimeoutGetOpponentInfo()

  return updateGameStatus(true)
    .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
    .then(() => opponent.syncPlayerInfo('SYNC_PLAYER'))
    .then(() => {
      hideCurrentPopup()
      showScreen('.pre-match-screen')
      updatePreMatchInfo(player, opponent)
    })
    .then(() => new Promise(resolve => setTimeout(resolve, 2000)))
    .then(() => {
      showScreen('.main-screen')
      playGame(gameMode)
    })
    .catch(error => {
      game.setConfig({ gameStatus: 'FREE' })
      hideCurrentPopup()
      throw error
    })
}

function syncGamePlayPVF(gameMode = 'pvf') {
  const game = Game.currentGame()
  game.setConfig({ gameStatus: 'WAITING' })
  showScreen('.main-screen')
  playGame(gameMode)

  // gameStatus = 'FREE'
  // hideCurrentPopup()
}

function notifyChallenge() {
  const game = Game.currentGame()
  const { config } = game

  if (config.gameStatus === 'FREE') {
    game.setConfig({ gameStatus: 'CHALLENGED' })
    showPopup()
  }
}

function randNum() {
  // random math: 2 number, operator and showResult
  // trueResult - num3 <= showResult <= trueResult + num3

  const score = parseInt($('#score').text())
  const range = score < 5 ? 9 : 20 // if score < 5, easier logic, with 1 number

  // random 3 number, num1 and num2 are operator, number 3 is diff from true result and show result
  var num1 = Math.floor(Math.random() * range + 1)
  var num2 = Math.floor(Math.random() * range + 1)
  const num3 = Math.floor(Math.random() * 5 + 1)

  switch (
    // random a number in ["+", "-"]
    // if score < 5, easier logic with "+" only
    operators[Math.floor(Math.random() * operators.length) * (score > 5)]
  ) {
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

  // set all randome number to game config
  const game = Game.currentGame()
  game.setConfig({ operator, num1, num2, trueResult, showResult })

  // show random number to web
  showRandowNumber(game)
}

function check(arg) {
  const game = Game.currentGame()
  const { trueResult, showResult } = game.config
  // check the result
  if (
    (arg == 'true' && trueResult == showResult) ||
    (arg != 'true' && trueResult != showResult)
  ) {
    // right user's answer, update score in view and turn green flash
    updateScore()
    randNum()
    turnFlash(true)
  } else {
    // wrong user's answer, turn red flash
    randNum()
    turnFlash(false)
  }
}

function updateTurnBestScore() {
  // update best score in this game turn
  // update async leaderboard only when turn best score is new
  const score = parseInt($('#score').text())
  const game = Game.currentGame()
  const { turnBestScore } = game.config

  if (turnBestScore < score) {
    game.setConfig({ turnBestScore: score })
    updateLeaderboard()
  }
}

function checkIsChallenge() {
  const game = Game.currentGame()
  const player = Player.currentPlayer()
  const opponent = game.gameInfo.player2
  const { contextType } = game.gameInfo
  const { playerID } = player
  const { opponentID } = opponent || {}

  if (contextType === 'THREAD' && playerID !== opponentID) {
    showScreen('.main-screen')
    playGame('fvp')
  }
}
