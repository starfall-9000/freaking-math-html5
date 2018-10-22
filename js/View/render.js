function renderListLeaderboard(data) {
  let list = ''
  if (gameEnv === 'DEV') {
    list = data.map(item => renderLeaderboardItem(item)).join('')
  } else {
    list = data
      .map((item, index) =>
        renderLeaderboardItem({
          rank: item.getRank() ? item.getRank() : index + 1,
          icon: item.getPlayer().getPhoto(),
          name: item.getPlayer().getName(),
          score: item.getScore()
        })
      )
      .join('')
  }

  $('#lb-table').empty()
  $('#lb-table').append(list)
}

function renderLeaderboardItem(item) {
  return (
    '<li class="lb-item">' +
    '<div class="lb-user">' +
    renderRank(item) +
    '<img class="lb-user-icon" src="' +
    item.icon +
    '"/>' +
    '<span class="lb-user-name">' +
    item.name +
    '</span>' +
    '</div>' +
    '<div class="lb-score-view">' +
    '<span class="lb-score">' +
    item.score +
    '</span>' +
    '<img class="lb-score-star" src="./images/ic-star-score.png" />' +
    '</div>' +
    '</li>'
  )
}

function renderRank(item) {
  var imageUrl = ''
  switch (item.rank) {
    case 1:
      imageUrl = './images/ic-lb-rank-1.png'
      break
    case 2:
      imageUrl = './images/ic-lb-rank-2.png'
      break
    case 3:
      imageUrl = './images/ic-lb-rank-3.png'
      break
    default:
      imageUrl = './images/ic-lb-rank-background.png'
      break
  }

  if (item.rank <= 3) {
    return '<img class="lb-rank-icon" src="' + imageUrl + '" />'
  } else {
    return (
      '<div class="lb-rank-icon lb-rank-icon-background">' +
      '<span class="lb-rank-number">' +
      item.rank +
      '</span>' +
      '</div>'
    )
  }
}
