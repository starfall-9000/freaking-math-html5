//home action

$(document).on('click', '#btn-home-play', function() {
  showScreen('.waiting-screen')

  matchPlayer()
    .then(() => syncGamePlay('pvp'))
    .catch(error => {
      console.log('Error when find a match with social player: ' + error)
      showScreen('.home-screen')
    })
})

$(document).on('click', '#btn-home-friend', function() {
  showScreen('.waiting-screen')

  choosePlayer()
    .then(() => syncGamePlayPVF('pvf'))
    .catch(error => {
      console.log('Error when find a match with your friend: ' + error)
      showScreen('.home-screen')
    })
})

$(document).on('click', '#btn-home-time', function() {
  showScreen('.main-screen')
  playGame('single')
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
  if (gameMode === 'single') {
    playGame('single')
  } else if (gameMode === 'fvp') {
    playGame('pvf')
  } else {
    showScreen('.pre-match-screen')

    syncGamePlay(gameMode).catch(error => {
      console.log('Error when find a match with social player: ' + error)
      showScreen('.home-screen')
    })
  }

  $('.pop-up-container').css('display', 'none')
})

$(document).on('click', '#btn-pop-up-go-home', function() {
  gameStatus = 'FREE'
  showScreen('.home-screen')
})

$(document).on('click', '.btn-back', function() {
  gameStatus = 'FREE'
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
  if (gameEnv === 'DEV') {
    hideQuitGamePopup()
  } else {
    FBInstant.quit()
  }
})

$(document).on('click', '#btn-quit-game-back', function() {
  gameStatus = 'FREE'
  hideQuitGamePopup()
})

// challenge action

$(document).on('click', '#btn-challenge-game', function() {
  hideChallengePopup()
  showScreen('.waiting-screen')
  syncGamePlayPVF('pvf')
})

$(document).on('click', '#btn-challenge-back', function() {
  rejectChallenge()
  gameStatus = 'FREE'
  hideChallengePopup()
})

$(document).on('click', '#btn-share-challenge', function() {
  shareChallenge()
})
