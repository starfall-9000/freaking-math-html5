//navigation controller

function showScreen(screenTag) {
  hideAllScreen()
  $(screenTag).css('display', 'flex')
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
