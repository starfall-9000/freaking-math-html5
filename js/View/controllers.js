//navigation controller

function showScreen(screenTag) {
  if (screenTag === '#quit-game-popup') {
    showQuitGamePopup()
  } else {
    hideAllScreen()
    $(screenTag).css('display', 'flex')
  }
}

function hideAllScreen() {
  $('.home-screen').css('display', 'none')
  $('.main-screen').css('display', 'none')
  $('.leaderboard-screen').css('display', 'none')
  $('.guide-screen').css('display', 'none')
  $('.pop-up-container').css('display', 'none')
  $('.pre-match-screen').css('display', 'none')
  $('.waiting-screen').css('display', 'none')
}

function showQuitGamePopup() {
  $('.pop-up-container').css('display', 'flex')
  $('#game-over-popup').css('display', 'none')
  $('#quit-game-popup').css('display', 'flex')
}

function hideQuitGamePopup() {
  $('#game-over-popup').css('display', 'block')
  $('#quit-game-popup').css('display', 'none')
  showScreen('.home-screen')
}

// home view controller

function updatePlayerAvatar(playerInfo) {
  $('.img-player-avatar').attr('src', playerInfo.avatar)
}

// main game view-controller

function resetScore() {
  $('#score').html('0')
  $('#time').css('right', '0')
}

function showRandowNumber(operator, num1, num2, showResult) {
  $('.operator').html(operator)
  $('.num1').html(num1)
  $('.num2').html(num2)
  $('.result').html(showResult)
}

function countDown(time = 150) {
  // set time out for per question
  const width = parseInt($('#time').css('width'))
  const distance = width / 10
  var countDownInterval = setInterval(function() {
    if (parseInt($('#time').css('width')) == 0) {
      clearInterval(countDownInterval)
      handleGameOver()
      updateTurnBestScore()
    }
    $('#time').css('right', parseInt($('#time').css('right')) + distance)
  }, time)
}

function updateScore() {
  var score = parseInt($('#score').text())
  $('#score').text(score + 1)
  $('#time').css('right', '0')
}

function handleGameOver() {
  if (
    $('.main-screen').css('display') === 'flex' &&
    $('.pop-up-container').css('display') !== 'flex'
  ) {
    // show game over pop up, score
    $('.pop-up-container').css('display', 'flex')
    $('#new-score').text($('#score').text())

    if (gameMode === 'single') {
      handleSingleModeGameOver()
    } else {
      handleVsModeGameOver()
      syncScoreData()
    }
  }
}

function handleSingleModeGameOver() {
  // show new score and best score for single mode
  $('#score-new-text').text('New')
  $('#score-best-text').text('Best')
  $('#best-score').css('display', 'block')
  $('#opponent-score').css('display', 'none')
  $('#pop-up-button-view').css('display', 'block')

  const score = parseInt($('#score').text())
  const bestScore = parseInt($('#best-score').text())
  // show yellow color for highest score
  if (score <= bestScore) {
    $('.ribbon').attr('src', './images/ribbon-game-over.png')
    $('#new-score').css('color', '#ffffff')
    $('#best-score').css('color', '#ffcf05')
  } else {
    $('.ribbon').attr('src', './images/ribbon-new-record.png')
    $('#new-score').css('color', '#ffcf05')
    $('#best-score').css('color', '#ffffff')
  }
}

function handleVsModeGameOver() {
  // show current score and opponent score for vs mode
  $('#score-new-text').text('You')
  $('#score-best-text').text('Waiting...')
  $('#best-score').css('display', 'none')
  $('#opponent-score').css('display', 'block')
  $('#opponent-score').text('')
  $('.ribbon').attr('src', './images/ribbon-game-over.png')
  $('#pop-up-button-view').css('display', 'none')
}

function handleSyncVsModeGameOver(opponentInfo) {
  // call after sync data
  if (opponentInfo.score) {
    const opponentScore = opponentInfo.score
    const yourScore = parseInt($('#new-score').text())
    $('#score-best-text').text(opponentInfo.playerName)
    $('#opponent-score').text(opponentScore)
    // show yellow color for highest score
    if (yourScore <= opponentScore) {
      $('#new-score').css('color', '#ffffff')
      $('#opponent-score').css('color', '#ffcf05')
    } else {
      $('#new-score').css('color', '#ffcf05')
      $('#opponent-score').css('color', '#ffffff')
    }
  } else {
    $('#score-best-text').text('No connect')
  }

  $('#pop-up-button-view').css('display', 'block')
}

function updateBestScore(playerInfo) {
  $('#best-score').text(playerInfo.bestScore)
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

function updatePreMatchInfo(playerInfo, opponentInfo) {
  $('.current-player-avatar').attr('src', playerInfo.avatar)
  $('.current-name-player').text(playerInfo.playerName)
  $('.opponent-player-avatar').attr('src', opponentInfo.avatar)
  $('.opponent-name-player').text(opponentInfo.playerName)
}
