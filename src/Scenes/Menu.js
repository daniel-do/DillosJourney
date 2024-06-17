class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

    }

    create() {
        // Create the tile backgrounds
        this.forest = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'noColorForest').setOrigin(0, 0);
        let menuConfig = {
            fontFamily: 'Arial',
            fontSize: '64px',
            color: 'blue',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.title = this.add.text(game.config.width / 2, game.config.height / 4, "Dillo's Journey", menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '32px';
        menuConfig.color = 'black';
        this.add.text(game.config.width / 2, game.config.height / 2, "Created by Daniel Do", menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, (game.config.height * 5) / 8, "Arrow keys to move", menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, (game.config.height * 3) / 4, "Press SPACE to start the journey!", menuConfig).setOrigin(0.5);

        // Define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            coinCount = 0;
            this.scene.start("platformerScene");
        }

        this.title.setScale(1 + Math.abs((Math.sin(this.game.loop.frame * 0.04) * 0.1)));
    }
}