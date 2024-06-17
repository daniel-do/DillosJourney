class Gameover extends Phaser.Scene {
    constructor() {
        super("gameoverScene");
    }

    preload() {

    }

    create() {
        // Create the tile backgrounds
        this.forest = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'forest').setOrigin(0, 0);
        let menuConfig = {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: 'black',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width / 2, game.config.height / 4, "Congrats!", menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2, "Dillo has completed its journey!", menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, (game.config.height * 3) / 4, "Press SPACE to start again", menuConfig).setOrigin(0.5);

        // Define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            coinCount = 0;
            this.scene.start("menuScene");
        }
    }
}