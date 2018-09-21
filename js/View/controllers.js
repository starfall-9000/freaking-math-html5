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
  if ($('.main-screen').css('display') === 'flex') {
    // show game over pop up, score
    $('.pop-up-container').css('display', 'flex')
    $('#new-score').text($('#score').text())

    // show yellow color for highest score
    const score = parseInt($('#score').text())
    const bestScore = parseInt($('#best-score').text())
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
  $('.current-name-player').text(playerInfo.name)
  $('.opponent-player-avatar').attr('src', opponentInfo.avatar)
  $('.opponent-name-player').text(opponentInfo.name)
}
