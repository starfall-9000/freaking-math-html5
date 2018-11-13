const FLASH_GREEN = 'flash-green' // green when result = true
const FLASH_RED = 'flash-red' // red when result = false
const FLASH_NONE = 'flash-none' // turn off flash

function turnFlash(result) {
  const flashCode = result ? FLASH_GREEN : FLASH_RED
  // turn flash in screen when check result
  $('.main-screen').attr('id', flashCode)
  setTimeout(() => {
    $('.main-screen').attr('id', FLASH_NONE)
  }, 70)
}
