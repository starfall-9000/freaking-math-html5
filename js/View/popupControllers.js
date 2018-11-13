function showPopup(popupTag) {
  hideAllPopup()

  $('.pop-up-container').css('display', 'flex')
  $('.pop-up-button-view').css('display', 'flex')
  if (popupTag === '#game-over-popup') {
    $('#game-over-popup').css('display', 'block')
  } else {
    $(popupTag).css('display', 'flex')
  }
}

function hideAllPopup() {
  $('#game-over-popup').css('display', 'none')
  $('#quit-game-popup').css('display', 'none')
  $('#alert-popup').css('display', 'none')
  $('#challenge-popup').css('display', 'none')
}

function hideCurrentPopup() {
  showScreen('.home-screen')
}

function showAlertPopup(msg) {
  showPopup('#alert-popup')
  $('.alert-message').text(msg)
}

function showAutoHideAlert(msg) {
  showPopup('#alert-popup')
  $('.alert-message').text(msg)

  setTimeout(hideCurrentPopup, 3000)
}
