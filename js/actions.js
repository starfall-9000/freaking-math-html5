//home action

$(document).on('click', '#btn-home-play', function() {
  showScreen('.main-screen')
  playGame()
})

$(document).on('click', '#btn-home-leaderboard', function() {
  showScreen('.leaderboard-screen')
})

$(document).on('click', '#btn-home-help', function() {
  showScreen('.guide-screen')
})

$(document).on('click', '#btn-home-sound', function() {
  const value = $(this).attr('value') === 'true'
  const imgUrl = value
    ? './images/btn-home-mute.png'
    : './images/btn-home-sound.png'
  $(this).attr('value', !value)
  $('#img-home-sound').attr('src', imgUrl)
})

//main action

$(document).on('click', '.btn-result', function() {
  check($(this).attr('value'))
})

$(document).on('click', '#btn-pop-up-replay', function() {
  playGame()
  $('.pop-up-container').css('display', 'none')
})

$(document).on('click', '#btn-pop-up-go-home', function() {
  showScreen('.home-screen')
})

$(document).on('click', '.btn-back', function() {
  showScreen('.home-screen')
})

//leaderboard action

$(document).on('click', '.btn-lb-back', function() {
  showScreen('.home-screen')
})

$(document).on('click', '#leaderboard-button', function() {
  getLeaderboard()
  showLeaderboard()
})

$(document).on('click', '#back-button', function() {
  showLeaderboard(false)
})
