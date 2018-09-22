var operators = ['+', '-']
var trueResult = 0
var showResult = 0
var turnBestScore = 0 // save best score in this game turn
var gameMode = 'single' // single | pvp | pvf

function playGame(type) {
  gameMode = type
  initGame()
  countDown(200)
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
