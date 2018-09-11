$(document).ready(function() {
  // app open
  initGame()
})

function initGame() {
  $('#score').html('0')
  $('#time').css('right', '0')
  randNum()
}

$(document).on('click', '.main-button', function() {
  check($(this).attr('value'))
})

var operators = ['+', '-']
var true_result = 0
var show_result = 0

function randNum() {
  // random math: 2 number, operator and show_result
  // true_result - 1 <= show_result <= true_result + 1
  var num1 = Math.floor(Math.random() * 20 + 1)
  var num2 = Math.floor(Math.random() * 20 + 1)
  switch (operators[Math.floor(Math.random() * operators.length)]) {
    case '+':
      $('.operator').html('+')
      true_result = num1 + num2
      show_result = true_result - Math.floor(Math.random() * 2)
      break
    case '-':
      $('.operator').html('-')
      true_result = num1 - num2
      show_result = true_result + Math.floor(Math.random() * 2)
      break
  }

  // show random number to web
  $('.num1').html(num1)
  $('.num2').html(num2)
  $('.result').html(show_result)
}

function check(arg) {
  // check the result
  if (
    (arg == 'true' && true_result == show_result) ||
    (arg != 'true' && true_result != show_result)
  ) {
    var score = parseInt($('#score').text())
    $('#score').text(score + 1)
    $('#time').css('right', '0')
    count_down()
    randNum()
  } else {
    gameOver()
  }
}

function disable_all() {
  $(document)
    .find('button')
    .attr('disabled', 'true')
}

function count_down(time = 150) {
  // set time out for per question
  const width = parseInt($('#time').css('width'))
  const distance = width / 10
  var countDownInterval = setInterval(function() {
    if (parseInt($('#time').css('width')) == 0) {
      clearInterval(countDownInterval)
      gameOver()
    }
    $('#time').css('right', parseInt($('#time').css('right')) + distance)
  }, time)
}

$(document).on('click', '#play-button', function() {
  playGame()
})

function playGame() {
  $('.pop-up-container').css('display', 'none')
  initGame()
  count_down(200)
  randNum()
}

function gameOver() {
  $('.pop-up-container').css('display', 'block')
  $('.pop-up-title').text('Score: ' + $('#score').text())
  $('#play-button').text('Try Again')
}

$(document).on('click', '#leaderboard-button', function() {
  getLeaderboard()
  showLeaderboard()
})

function getLeaderboard() {
  const data = [
    {
      name: 'An Binh',
      score: 10,
      icon:
        'https://platform-lookaside.fbsbx.com/platform/instantgames/profile_pic.jpg'
    },
    {
      name: 'An Binh',
      score: 5,
      icon:
        'https://platform-lookaside.fbsbx.com/platform/instantgames/profile_pic.jpg'
    },
    {
      name: 'An Binh',
      score: 3,
      icon:
        'https://platform-lookaside.fbsbx.com/platform/instantgames/profile_pic.jpg'
    }
  ]
  renderListLeaderboard(data)
}

function renderListLeaderboard(data) {
  const list = data.map(item => renderLeaderboardItem(item)).join('')
  $('#leaderboard-table').empty()
  $('#leaderboard-table').append(list)
}

function renderLeaderboardItem(item) {
  return (
    '<li class="leaderboard-item">' +
    '<div class="lb-user">' +
    '<img class="lb-user-icon" src="' +
    item.icon +
    '"/>' +
    '<span class="lb-user-name">' +
    item.name +
    '</span>' +
    '</div>' +
    '<span class="lb-score">' +
    item.score +
    '</span>' +
    '</li>'
  )
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

$(document).on('click', '#back-button', function() {
  showLeaderboard(false)
})
