class Scene1 extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  preload(){
    this.load.image("background", "assets/images/background2.png");
    this.load.spritesheet("ship", "assets/spritesheets/ship.png",{
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("ship2", "assets/spritesheets/ship2.png",{
      frameWidth: 32,
      frameHeight: 16
    });
    this.load.spritesheet("ship3", "assets/spritesheets/ship3.png",{
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("explosion", "assets/spritesheets/explosion.png",{
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("power-up", "assets/spritesheets/power-up.png",{
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("player", "assets/spritesheets/player1.png",{
      frameWidth: 16,
      frameHeight: 24
    });
    this.load.audio('bgm', "assets/audio/introbgm.mp3");
    this.load.audio('space', 'assets/audio/shootsfx.mp3');
    this.load.audio('ShipHitSFX', 'assets/audio/explodeEffect.mp3');
    this.load.audio('1Phit', 'assets/audio/hitsfx.mp3');
    this.load.audio('winSound', 'assets/audio/youwinsfx.mp3');
    this.load.audio('loseSound', 'assets/audio/gameoversfx.mp3');
    this.load.audio('powerup', 'assets/audio/powerupsfx.mp3');
    this.load.spritesheet("beam", "assets/spritesheets/beam.png",{
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.bitmapFont('pixelFont', 'assets/font/font.png', 'assets/font/font.xml');
  }

  create() {
    const music = this.sound.add('bgm', { 
      loop: true,
      volume: 0.3
    });
    music.play();
    
    this.add.text(20, 20, "Loading game...");
    this.scene.start("playGame");

    this.anims.create({
      key: "ship1_anim",
      frames: this.anims.generateFrameNumbers("ship"),
      frameRate: 90,
      repeat: -1
    });
    this.anims.create({
      key: "ship2_anim",
      frames: this.anims.generateFrameNumbers("ship2"),
      frameRate: 90,
      repeat: -1
    });
    this.anims.create({
      key: "ship3_anim",
      frames: this.anims.generateFrameNumbers("ship3"),
      frameRate: 90,
      repeat: -1
    });

    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    }).on('animationcomplete', function() {
      this.sound.play('ShipHitSFX');
    }, this);

    this.anims.create({
      key: "red",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 0,
        end: 1
      }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "gray",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 2,
        end: 3
      }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "thrust",
      frames: this.anims.generateFrameNumbers("player"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "beam_anim",
      frames: this.anims.generateFrameNumbers("beam"),
      frameRate: 20,
      repeat: -1
    });

    this.input.keyboard.on('keydown_UP', function (event) {
      event.preventDefault();
    });
    
    this.input.keyboard.on('keydown_DOWN', function (event) {
      event.preventDefault();
    });
  }
}

