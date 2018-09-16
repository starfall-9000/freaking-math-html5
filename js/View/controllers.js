function resetScore() {
  $('#score').html('0')
  $('#time').css('right', '0')
}

function hidePopup() {
  $('.pop-up-container').css('display', 'none')
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
      updateLeaderboard()
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
  $('.pop-up-container').css('display', 'block')
  $('.pop-up-title').text('Score: ' + $('#score').text())
  $('#play-button').text('Try Again')
}

function showLeaderboard(isShow = true) {
  if (isShow) {
    $('.leaderboard-content').css('display', 'block')
    $('.pop-up-content').css('display', 'none')
  } else {
    $('.leaderboard-content').css('display', 'none')
    $('.pop-up-content').css('display', 'block')
  }
}
