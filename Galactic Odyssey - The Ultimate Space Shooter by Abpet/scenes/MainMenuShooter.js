class MainMenuShooter extends Phaser.Scene {
  constructor() {
    super("mainMenu");
  }

  preload() {
    this.load.image("menuBackground", "assets/images/BG.png");
    this.load.image("logo", "assets/images/gamelogo2.png");
    this.load.image("startButton", "assets/buttons/Start.png");
    this.load.image("infoButton", "assets/buttons/Information.png");
    this.load.image("exitButton", "assets/buttons/Exit.png");
    this.load.audio("bgMusic", "assets/audio/gamebgm.mp3");
    this.load.on('complete', () => {
      this.sound.add('bgMusic', { 
          loop: true,
          volume: 0.4
      }).play();
  });
  }

  create() {
    const bgImage = this.add.image(0, 0, "menuBackground").setOrigin(0, 0);
    bgImage.setScale(
      this.game.config.width / bgImage.width,
      this.game.config.height / bgImage.height
    );

    const logo = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 4,
      "logo"
    ).setOrigin(0.5);
    logo.setScale(0.5); 

    const startButton = this.add.sprite(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "startButton"
    ).setOrigin(0.5);
    startButton.setScale(0.5)
    startButton.setInteractive();

    startButton.on("pointerdown", function () {
      this.sound.stopAll();
      this.scene.start("bootGame");
    }, this);

    const infoButton = this.add.sprite(
      this.game.config.width / 2,
      this.game.config.height / 1.65,
      "infoButton"
      ).setOrigin(0.5);
      infoButton.setScale(0.5)
      infoButton.setInteractive();
    
      infoButton.on("pointerdown", function () {
        this.sound.add('bgMusic')
      this.scene.start("howToPlay");
      }, this);

    const exitButton = this.add.sprite(
      this.game.config.width / 2,
      this.game.config.height / 1.40,
      "exitButton"
    ).setOrigin(0.5);
    exitButton.setScale(0.5);
    exitButton.setInteractive();

    exitButton.on("pointerdown", function () {
      const confirmed = window.confirm("Are you sure you want to exit the game?");
      if (confirmed) {
        window.close();
      }
    });
  }
}