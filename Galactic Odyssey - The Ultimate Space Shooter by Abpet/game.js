var gameSettings = {
  playerSpeed: 400,
  maxPowerups: 3,
  powerUpVel: 50,
}

var config = {
  type : Phaser.Auto,
  width: 600,
  height: 665,
  parent: 'game-container',
  backgroundColor: 0x000000,
  scene: [MainMenuShooter, HowToPlay, Scene1, Scene2],
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade:{
        debug: false
    }
  }
}

var game = new Phaser.Game(config);