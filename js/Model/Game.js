class Game {
  constructor() {}

  static currentGame() {
    if (!this.instant) {
      var instant = new Game()

      instant.config = {
        operators: ['+', '-'],
        num1: 0,
        num2: 0,
        trueResult: 0,
        showResult: 0,
        turnBestScore: 0, // save best score in this game turn
        gameMode: 'single', // single | pvp | pvf | fvp
        gameStatus: 'FREE', // FREE | PLAYED | CHALLENGED | WAITING
        gameEnv: 'DEV' // DEV | PROD
      }

      const contextID =
        instant.config.gameEnv === 'DEV'
          ? mockPlayerInfo.contextID
          : FBInstant.context.getID()
      const contextType =
        instant.config.gameEnv === 'DEV'
          ? 'THREAD-'
          : FBInstant.context.getType()
      const player1 =
        instant.config.gameEnv === 'DEV'
          ? mockPlayerInfo
          : Player.currentPlayer()
      let player2 = Player.challengePlayer()

      instant.gameInfo = {
        contextID,
        contextType,
        player1,
        player2
      }

      this.instant = instant
    }

    return this.instant
  }

  setConfig(config) {
    const listConfigKey = Object.keys(config)
    listConfigKey.forEach(key => {
      const value = config[key]
      this.config[key] = value
    })
  }

  syncScoreData() {
    const opponent = this.gameInfo.player2
    setTimeoutGetOpponentInfo()
    updatePlayerScore()
      .then(() => new Promise(resolve => setTimeout(resolve, 3000)))
      .then(() => opponent.syncPlayerInfo('SYNC_SCORE'))
      .then(() => handleSyncVsModeGameOver(opponent))
      .catch(error => console.error(error))
  }
}
