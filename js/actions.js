$(document).on('click', '#btn-home-play', function() {
  console.log('click play')
})

$(document).on('click', '.btn-result', function() {
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
