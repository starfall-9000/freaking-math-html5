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
  showPopup('#quit-game-popup')
})

//main action

$(document).on('click', '.btn-result', function() {
  check($(this).attr('value'))
})

$(document).on('click', '#btn-pop-up-replay', function() {
  const game = Game.currentGame()
  const { gameMode } = game.config
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
  const game = Game.currentGame()
  game.setConfig({ gameStatus: 'FREE' })
  showScreen('.home-screen')
})

$(document).on('click', '.btn-back', function() {
  const game = Game.currentGame()
  game.setConfig({ gameStatus: 'FREE' })
  showScreen('.home-screen')
})

$(document).on('click', '#btn-pop-up-exit', function() {
  showPopup('#quit-game-popup')
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
    hideCurrentPopup()
  } else {
    FBInstant.quit()
  }
})

$(document).on('click', '#btn-quit-game-back', function() {
  const game = Game.currentGame()
  game.setConfig({ gameStatus: 'FREE' })
  hideCurrentPopup()
})

// challenge action

$(document).on('click', '#btn-challenge-game', function() {
  hideCurrentPopup()
  showScreen('.waiting-screen')
  syncGamePlayPVF('pvf')
})

$(document).on('click', '#btn-challenge-back', function() {
  rejectChallenge()
  const game = Game.currentGame()
  game.setConfig({ gameStatus: 'FREE' })
  hideCurrentPopup()
})

$(document).on('click', '#btn-share-challenge', function() {
  const game = Game.currentGame()
  game.setConfig({ gameStatus: 'FREE' })
  shareChallenge()
})
