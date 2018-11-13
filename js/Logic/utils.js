function convertBase64Image(imagePath) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', imagePath, true)
    xhr.responseType = 'blob'
    xhr.send()
    xhr.onload = event => resolve(xhr, event)
  })
    .then((xhr, event) => {
      return new Promise((resolve, reject) => {
        var reader = new FileReader()
        var file = xhr.response
        reader.readAsDataURL(file)
        reader.onload = event => resolve(event)
      })
    })
    .then(event => event.target.result)
}
