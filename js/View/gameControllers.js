// home view controller

function updatePlayerAvatar(player = Player.currentPlayer()) {
  // update current player avatar in home screen
  $('.img-player-avatar').attr('src', player.avatar)
}

// main game view-controller

function resetScore() {
  // turn score in view return 0
  $('#score').html('0')
  $('#time').css('right', '0')
}

function showRandowNumber(game = Game.currentGame()) {
  const { operator, num1, num2, showResult } = game.config
  // show random number from game to main screen

  $('.operator').html(operator)
  $('.num1').html(num1)
  $('.num2').html(num2)
  $('.result').html(showResult)
}

function countDown(time = 100) {
  // set time out for per question
  const width = parseInt($('#time').css('width'))

  // distance = width / (second * 10)
  const distance = width / 200
  var countDownInterval = setInterval(function() {
    if (parseInt($('#time').css('width')) == 0) {
      clearInterval(countDownInterval)
      const game = Game.currentGame()
      handleGameOver(game)
      updateTurnBestScore()
    }
    $('#time').css('right', parseInt($('#time').css('right')) + distance)
  }, time) // time for per count down and change in view
}

function updateScore() {
  // update score in view
  var score = parseInt($('#score').text())
  $('#score').text(score + 1)
  // $('#time').css('right', '0')
}

function handleGameOver(game) {
  if (
    $('.main-screen').css('display') === 'flex' &&
    $('.pop-up-container').css('display') !== 'flex'
  ) {
    // show game over pop up, score
    resetGameOverPopup()
    showPopup('#game-over-popup')
    $('#new-score').text($('#score').text())

    const { gameMode } = game.config
    // handle showing popup with correct game mode
    if (gameMode === 'single') {
      handleSingleModeGameOver()
    } else if (gameMode === 'pvf') {
      handlePvfModeGameOver()
      // syncChallengeData()
    } else if (gameMode === 'fvp') {
      handleVsModeGameOver()
      syncChallengeData()
    } else {
      // if (gameMode === 'pvp')
      handleVsModeGameOver()
      game.syncScoreData()
    }
  }
}

function resetGameOverPopup() {
  // reset all form in game-over popup to default
  $('.score-result-view').css('display', 'block')
  $('.pop-up-button-view').css('display', 'flex')

  $('.best-score-result').css('display', 'none')
  $('.pvf-challenge-view').css('display', 'none')

  $('#score-new-text').text('New')
  $('#score-best-text').text('Best')
  $('#best-score').css('display', 'none')
  $('#opponent-score').css('display', 'none')
  $('#opponent-score').text('')

  $('.ribbon').attr('src', './images/ribbon-game-over.png')
  $('#new-score').css('color', '#ffffff')
  $('#best-score').css('color', '#ffcf05')
  $('#opponent-score').css('color', '#ffcf05')
}

function handleSingleModeGameOver() {
  // show new score and best score for single mode
  $('.best-score-result').css('display', 'flex')
  $('#best-score').css('display', 'block')

  const score = parseInt($('#score').text())
  const bestScore = parseInt($('#best-score').text())
  // show yellow color for highest score
  if (score > bestScore) {
    $('.ribbon').attr('src', './images/ribbon-new-record.png')
    $('#new-score').css('color', '#ffcf05')
    $('#best-score').css('color', '#ffffff')
  }
}

function handleVsModeGameOver() {
  // show current score and opponent score for vs mode
  $('.pop-up-button-view').css('display', 'none')

  $('.best-score-result').css('display', 'flex')

  $('#score-new-text').text('You')
  $('#score-best-text').text('Waiting...')
  $('#opponent-score').css('display', 'block')

  setTimeout(() => {
    if ($('#score-best-text').text() === 'Waiting...') {
      handleSyncVsModeGameOver({})
    }
  }, 15000)
}

function handleSyncVsModeGameOver(opponent) {
  // call after sync challenge data in fvp or sync score data in pvp
  $('.pop-up-button-view').css('display', 'flex')

  // opponent = {} when time out and can't sync score in pvp
  if (opponent.score !== null && opponent.score !== undefined) {
    const opponentScore = opponent.score
    const yourScore = parseInt($('#new-score').text())

    // show opponent's name and score
    $('.best-score-result').css('display', 'flex')
    $('#score-best-text').text(opponent.playerName)
    $('#opponent-score').text(opponentScore)

    // show yellow color for higher score, default higher is opponent score
    if (yourScore > opponentScore) {
      $('#new-score').css('color', '#ffcf05')
      $('#opponent-score').css('color', '#ffffff')
    }
  } else {
    // show error when timeout and cannot sync score
    $('#score-best-text').text('No connect')
  }
}

function handlePvfModeGameOver() {
  //show challenge button
  $('.pvf-challenge-view').css('display', 'flex')
  // show current score
  $('#score-new-text').text('Score')

  $('#opponent-score').css('display', 'block')
  $('.pop-up-button-view').css('display', 'none')
}

function updateBestScore({ bestScore }) {
  // update best score when get data from leaderboard
  // the text in #best-scoreit will use for bestScore variable
  // and should not be update normally
  $('#best-score').text(bestScore)
}

// leaderboard view-controller

function showLeaderboard(type = 'FRIEND') {
  if (type === 'FRIEND') {
    $('#btn-lb-friend').attr(
      'class',
      'btn-leaderboard btn-lb-tabar btn-lb-select btn-lb-friend'
    )
    $('.btn-lb-week').attr(
      'class',
      'btn-leaderboard btn-lb-tabar btn-lb-unselect btn-lb-week'
    )
  } else {
    $('#btn-lb-friend').attr(
      'class',
      'btn-leaderboard btn-lb-tabar btn-lb-unselect btn-lb-friend'
    )
    $('.btn-lb-week').attr(
      'class',
      'btn-leaderboard btn-lb-tabar btn-lb-select btn-lb-week'
    )
  }
}

// pre-match view-controller

function updatePreMatchInfo(player, opponent) {
  // show info of two player before starting a match
  $('.current-player-avatar').attr('src', player.avatar)
  $('.current-name-player').text(player.playerName)
  $('.opponent-player-avatar').attr('src', opponent.avatar)
  $('.opponent-name-player').text(opponent.playerName)
}
