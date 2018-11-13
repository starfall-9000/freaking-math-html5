class Player {
  constructor(playerID) {
    this.playerID = playerID
  }

  static currentPlayer() {
    if (!this.instant) {
      const playerInfo = this.getCurrentPlayerInfo()
      const {
        playerID,
        playerName,
        avatar,
        bestScore,
        score,
        contextID
      } = playerInfo

      const player = new Player(playerID)
      player.contextID = contextID
      player.playerName = playerName
      player.avatar = avatar
      player.bestScore = bestScore

      this.instant = player
    }

    // warning: need to update score from controller
    this.instant.score = parseInt($('#score').text())

    return this.instant
  }

  static getCurrentPlayerInfo() {
    const game = Game.currentGame()
    const { gameEnv } = game.config

    if (gameEnv !== 'DEV') {
      const playerID = FBInstant.player.getID()
      const playerName = FBInstant.player.getName()
      const avatar = FBInstant.player.getPhoto()
      const bestScore = 0
      const score = 0
      return { playerID, playerName, avatar, bestScore, score }
    }

    return mockPlayerInfo
  }

  static challengePlayer() {
    const entryPointData =
      gameEnv === 'DEV' ? mockOpponentInfo : FBInstant.getEntryPointData()

    if (!entryPointData) return

    const { playerID, playerName, score, contextID, avatar } = entryPointData
    const opponent = new Player(playerID)
    opponent.playerName = playerName
    opponent.score = score
    opponent.contextID = contextID
    opponent.avatar = avatar

    return opponent
  }

  syncPlayerInfo(type) {
    // need to call api get player info by id.
    const { playerID, playerName, avatar, bestScore, score } = mockPlayerInfo

    this.playerID = playerID
    this.playerName = playerName
    this.avatar = avatar
    this.bestScore = bestScore
    this.score = score
  }
}
