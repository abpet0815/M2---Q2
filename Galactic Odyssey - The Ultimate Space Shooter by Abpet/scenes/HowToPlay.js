class HowToPlay extends Phaser.Scene {
    constructor() {
      super("howToPlay");
    }
  
    preload() {
      this.load.image('instructions', 'assets/images/Information.png');
      this.load.image('closeButton', 'assets/buttons/Close.png');
    }
  
    create() {
      const backgroundImage = this.add.image(
        this.game.config.width / 2,
        this.game.config.height / 2,
        "menuBackground"
      );
      backgroundImage.setOrigin(0.5);
  
      const instructionsImage = this.add.image(
        this.game.config.width / 2,
        this.game.config.height / 2,
        "instructions"
      );
      instructionsImage.setOrigin(0.5);
      instructionsImage.setScale(0.45); 

      const exitButton = this.add.image(
        this.game.config.width - 550,
        10,
        "closeButton"
      );
      exitButton.setOrigin(1, 0);
      exitButton.setScale(0.20); 
      exitButton.setInteractive(); 
      exitButton.on("pointerdown", function () {
        this.scene.start("mainMenu");
      }, this);
    }
  }