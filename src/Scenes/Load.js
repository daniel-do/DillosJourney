class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.image("tilemap_farm_tiles", "tilemap_farm_packed.png");
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON

        this.load.spritesheet('coin', 'coin_spritesheet.png', { frameWidth: 18, frameHeight: 18, startFrame: 0, endFrame: 1});

        // Load the tilemap as a spritesheet
        this.load.spritesheet('flag', 'flag_spritesheet.png', { frameWidth: 18, frameHeight: 18, startFrame: 0, endFrame: 1});

        // background
        this.load.image("forest", "backgroundColorForest.png");

        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 21,
                end: 23,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0021.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0022.png" }
            ],
        });

        this.anims.create({
            key: 'movingCoin',
            frames: this.anims.generateFrameNumbers('coin', { 
                start: 0, 
                end: 1, 
                first: 0
            }),
            frameRate: 5
        });

        this.anims.create({
            key: 'movingFlag',
            frames: this.anims.generateFrameNumbers('flag', { 
                start: 0, 
                end: 1, 
                first: 0
            }),
            frameRate: 5
        });

         // ...and pass to the next Scene
         this.scene.start("menuScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}