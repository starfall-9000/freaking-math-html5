function renderListLeaderboard(data) {
  const list = data.map(item => renderLeaderboardItem(item)).join('')
  $('#leaderboard-table').empty()
  $('#leaderboard-table').append(list)
}

function renderLeaderboardItem(item) {
  return (
    '<li class="leaderboard-item">' +
    '<div class="lb-user">' +
    '<img class="lb-user-icon" src="' +
    item.icon +
    '"/>' +
    '<span class="lb-user-name">' +
    item.name +
    '</span>' +
    '</div>' +
    '<span class="lb-score">' +
    item.score +
    '</span>' +
    '</li>'
  )
}
