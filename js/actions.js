//home action

$(document).on('click', '#btn-home-play', function() {
  showScreen('.main-screen')
  playGame()
})

$(document).on('click', '#btn-home-leaderboard', function() {
  showScreen('.leaderboard-screen')
  getLeaderboard()
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

$(document).on('click', '#btn-home-exit', function() {
  showScreen('#quit-game-popup')
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

$(document).on('click', '#btn-pop-up-exit', function() {
  showScreen('#quit-game-popup')
})

//leaderboard action

$(document).on('click', '.btn-lb-back', function() {
  showScreen('.home-screen')
})

$(document).on('click', '.btn-lb-friend', function() {
  showLeaderboard('FRIEND')
})

$(document).on('click', '.btn-lb-week', function() {
  showLeaderboard('WEEK')
})

// quit-game action

$(document).on('click', '#btn-quit-game', function() {
  hideQuitGamePopup()
})

$(document).on('click', '#btn-quit-game-back', function() {
  hideQuitGamePopup()
})
