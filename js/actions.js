$(document).on('click', '.main-button', function() {
  check($(this).attr('value'))
})

$(document).on('click', '#play-button', function() {
  playGame()
})

$(document).on('click', '#leaderboard-button', function() {
  getLeaderboard()
  showLeaderboard()
})

$(document).on('click', '#back-button', function() {
  showLeaderboard(false)
})
