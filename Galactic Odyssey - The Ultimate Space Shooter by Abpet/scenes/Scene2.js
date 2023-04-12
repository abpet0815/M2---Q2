class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {

    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);

    var graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0,0);
    graphics.lineTo(config.width, 0);
    graphics.lineTo(config.width, 20);
    graphics.lineTo(0, 20);
    graphics.lineTo(0,0);
    graphics.closePath();
    graphics.fillPath();

    this.lives = 3;
    this.score = 0;
    this.scoreLabel = this.add.bitmapText(10, 5, 'pixelFont', 'SCORE:', 16);
    this.livesLabel = this.add.bitmapText(550, 5, 'pixelFont', 'LIVES:', 16);
    this.livesCountLabel = this.add.bitmapText(585, 5, 'pixelFont', this.lives, 16);

    this.ship1 = this.add.sprite(config.width / 2 - 50, config.height / 2, "ship");
    this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
    this.ship3 = this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3");

    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);
    

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on('gameobjectdown', this.destroyShip, this);

    this.physics.world.setBoundsCollision();
    this.powerUps = this.physics.add.group();

    for (var i = 0; i < gameSettings.maxPowerups; i++) {
      var powerUp = this.physics.add.sprite(16, 16, "power-up");
      this.powerUps.add(powerUp);
       powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);

      if (Math.random() > 0.5) {
        powerUp.play("red");
      } else {
        powerUp.play("gray");
      }

      powerUp.setVelocity(gameSettings.powerUpVel, gameSettings.powerUpVel);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);
    }

    this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.on('keydown_SPACE', () => {
      this.sound.play('space', { 
        volume: 0.15
      }).once;
    });

    this.projectiles = this.add.group();

    this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerup){
      projectile.destroy();
    });

    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
  }


  pickPowerUp(player, powerUp){
    powerUp.disableBody(true, true);  
    this.sound.play('powerup'); 
  };

  hurtPlayer(player, enemy){
    this.resetShipPos(enemy);
  
    if(this.player.alpha < 1 || this.lives <= 0){
      return;
    }
  
    var explosion = new Explosion(this, player.x, player.y);
    player.disableBody(true, true);
  
    this.sound.play('1Phit');
  
    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });
     
    this.lives -= 1;
    this.updateLives();
    if (this.lives <= 0) {
      this.gameOver();

      this.livesCountLabel.text = this.lives;

    }
  }

  hitEnemy(projectile, enemy){
    var explosion = new Explosion(this, enemy.x, enemy.y);
    var scoreFormatted = this.zeroPad(this.score, 6);

    projectile.destroy();

    this.resetShipPos(enemy);
    this.score += 15;
    this.scoreLabel.text = 'SCORE: ' + scoreFormatted;

    if (this.score >= 5000) {
        this.youWin();
    }

    var explosionSFX = this.sound.add('ShipHitSFX');
    explosionSFX.play();
}

  update() {
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip(this.ship3, 3);

    this.background.tilePositionY -= 0.5;

    this.movePlayerManager();
    

    if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
      this.shootBeam();;
    }

    for(var i = 0; i < this.projectiles.getChildren().length; i++){
      var beam = this.projectiles.getChildren()[i];
      beam.update();
    }

    if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
      if(this.player.active){
        this.shootBeam();
      }
    }
  }


  shootBeam(){
    var beam = new Beam(this);
  }

  movePlayerManager() {
    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(gameSettings.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }

  moveShip(ship, speed) {
    ship.y += speed;
    if (ship.y > config.height) {
      this.resetShipPos(ship);
    }
  }

  resetShipPos(ship) {
    ship.y = 0;
    var randomX = Phaser.Math.Between(0, config.width);
    ship.x = randomX;
  }

  resetPlayer(){
    var x = config.width / 2-8;
    var y = config.height + 64;
    this.player.enableBody(true, x, y, true, true);

    this.player.alpha = 0.5;

    var tween = this.tweens.add({
      targets: this.player,
      y: config.height - 64,
      ease: 'Power1',
      duration: 1500,
      repeat: 0,
      onComplete: function(){
        this.player.alpha = 1;
      },
      callbackScope: this
    });
  }

  updateLives() {
    this.livesLabel.text = 'LIVES: ' + '♥'.repeat(this.lives);
    this.livesCountLabel.text = this.lives;
  }


  gameOver() {
    this.sound.stopAll();
    this.sound.play('loseSound',
    { 
      volume: 0.50
    });
    this.add.bitmapText(config.width / 2 - 50, config.height / 2, 'pixelFont', 'GAME OVER', 32);
    this.physics.pause();
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.sound.stopAll();
        this.scene.start('mainMenu');
        this.sound.play('bgMusic')
      },
      callbackScope: this,
      loop: false
    });
  }

  youWin() {

    this.sound.stopAll();
    this.sound.play('winSound',
    { 
      volume: 4
    });

    var winLabel = this.add.bitmapText(config.width / 2, config.height / 2, 'pixelFont', 'YOU WIN!', 32);
    winLabel.setOrigin(0.5);
    this.physics.pause();
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        winLabel.destroy();
        this.sound.stopAll();
        this.scene.start('mainMenu');
        this.sound.play('bgMusic')
      },
      loop: false
    });
  }

  destroyShip() {
    this.setTexture("explosion");
    this.play("explode");
    this.sound.play('ShipHitSFX');
    this.on('animationcomplete', () => {
      this.destroyShip();
    });
  }

  zeroPad(number, size){
    var stringNumber = String(number);
    while(stringNumber.length < (size || 2)){
      stringNumber = '0' + stringNumber;
    }
    return stringNumber;
  }
}