class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' })
  }

  preload() {
    this.load.image('start', 'https://i.ibb.co/N1GgRVT/Hey-kiddo-1.png');
  }
  create() {
    const screen = this.add.image(0, 0, 'start').setOrigin(0);
    
    // on keypress any, transition to GameScene
    this.input.keyboard.on('keydown', () => { 
	  const screen = this.add.image(0, 0, 'start').setOrigin(0);
      this.scene.stop('StartScene');
      this.scene.start('GameScene');
    });
  }
}