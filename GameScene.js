let score = 0;
const coinMultiplier = 100;
let speed = 1;
const gameState = {
  numCoordinates: {},
};
let randomCoord;
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }
  preload() {
    this.load.image('guy-front', 'https://i.ibb.co/Lg82cP5/5.png');
    this.load.image('guy-back', 'https://i.ibb.co/Lg82cP5/5.png');
    this.load.image('guy-side', 'https://i.ibb.co/SBZsrNP/6.png');
    this.load.image('coin', 'https://i.ibb.co/VBL6s92/1.png');
    this.load.image('fools-gold', 'https://i.ibb.co/KjtVnQN/Untitled-design-7.png');
  }
  create() {
    let scoreText = this.add.text(140, 610, `Earnings: 🪙${score}`, { fontSize: '25px', fill: '#fff' });
    gameState.player = this.physics.add.sprite(240, 500, 'guy-front').setScale(.8);
    this.physics.world.setBounds(0, 0, 480, 600);  // Slightly above score
    gameState.player.setCollideWorldBounds(true);
    gameState.player.body.collideWorldBounds = true;
    randomCoord = assignCoords();
    gameState.coin = this.physics.add.sprite(randomCoord.x, randomCoord.y, 'coin').setScale(.5);
    gameState.enemies = this.physics.add.group();
    this.physics.add.overlap(gameState.player, gameState.coin, () => {
      gameState.coin.disableBody();
      delete gameState.numCoordinates[`x${gameState.coin.x}y${gameState.coin.y}`];
      randomCoord = assignCoords();
      gameState.coin.enableBody(true, randomCoord.x, randomCoord.y);
      score += (Math.round(Math.random() * 10) * coinMultiplier);
      scoreText.setText(`Earnings: \🪙+${score}`);
      randomCoord = assignCoords();
      gameState.enemies.create(randomCoord.x, randomCoord.y, 'fools-gold').setScale(.6);
    });
    this.physics.add.collider(gameState.player, gameState.enemies, () => this.endGame());
    function generateRandomCoords () {
      const randomX = Math.floor(Math.random() * 5) * 75 + 25
      const randomY = Math.floor(Math.random() * 5) * 75 + 25
      return { x: randomX, y: randomY }
    }
    function assignCoords () {
      let assignedCoord = generateRandomCoords();
      while (gameState.numCoordinates[`x${assignedCoord.x}y${assignedCoord.y}`]) {
        assignedCoord = generateRandomCoords()
      }
      gameState.numCoordinates[`x${assignedCoord.x}y${assignedCoord.y}`] = true
      return assignedCoord;
    }
  }
  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    const rightArrow = cursors.right.isDown;const leftArrow = cursors.left.isDown;const upArrow = cursors.up.isDown;const downArrow = cursors.down.isDown;
    if (rightArrow) {
      moveguyRight();
    } else if (leftArrow) {
      moveguyLeft();
    } else if (upArrow) {
      moveguyUp();
    } else if (downArrow) {
      moveguyDown();
    }
    const guyXCoord = gameState.player.x;const guyYCoord = gameState.player.y;
    if (guyXCoord >= 448 || guyXCoord <= 32) {this.endGame();}
    if (guyYCoord >= 568 || guyYCoord <= 32) {this.endGame();}
    function moveguyRight () {gameState.player.flipX = false;gameState.player.setTexture('guy-side');gameState.player.setVelocityX(150) * speed;gameState.player.setVelocityY(0) * speed;}
    function moveguyLeft () {gameState.player.flipX = true;gameState.player.setTexture('guy-side');gameState.player.setVelocityX(-150) * speed;gameState.player.setVelocityY(0) * speed;}
    function moveguyUp () {gameState.player.flipX = false;gameState.player.setTexture('guy-back');gameState.player.setVelocityX(0) * speed;gameState.player.setVelocityY(-150) * speed;}
    function moveguyDown () {gameState.player.flipX = false;gameState.player.setTexture('guy-front');gameState.player.setVelocityX(0) * speed;gameState.player.setVelocityY(150) * speed;}
  }
  endGame () {
    this.physics.pause();
    this.cameras.main.fade(800, 0, 0, 0, false, function (camera, progress) {
      if (progress > .5) {
        this.scene.stop('GameScene');this.scene.start('EndScene');
      }
    });
  }
}
