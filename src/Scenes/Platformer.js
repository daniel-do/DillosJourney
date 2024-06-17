class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
        this.drown = this.drown.bind(this);
        this.finish = this.finish.bind(this);
    }

    init() {
        // variables and settings
        this.ACCELERATION = 500;
        this.DRAG = 5000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -700;
        this.VELOCITY = 300;
        this.PARTICLE_VELOCITY = 10;
        this.SCALE = 2.0;
    }

    create() {
        // Create the tile backgrounds
        this.forest = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'forest').setOrigin(0, 0);
        this.forest2 = this.add.tileSprite(0, 0, game.config.width*2, game.config.height, 'forest').setOrigin(0, 0);
        this.forest3 = this.add.tileSprite(0, 0, game.config.width*3, game.config.height, 'forest').setOrigin(0, 0);

        this.physics.world.setBounds(0,0, 18*80*3, 40*18*3);
        this.cameras.main.setBounds(0,0,18*80*3, 40*18);

        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.tilesetFarm = this.map.addTilesetImage("farm_tilemap_packed", "tilemap_farm_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.groundLayer.setScale(2.0);
        this.overlapLayer = this.map.createLayer("Overlap", this.tileset, 0, 0);
        this.overlapLayer.setScale(2.0);
        this.waterLayer = this.map.createLayer("Water", this.tileset, 0, 0);
        this.waterLayer.setScale(2.0);
        this.farmGroundLayer = this.map.createLayer("Farm-Ground-n-Platforms", this.tilesetFarm, 0, 0);
        this.farmGroundLayer.setScale(2.0);
        this.farmOverlapLayer = this.map.createLayer("Farm-Overlap", this.tilesetFarm, 0, 0);
        this.farmOverlapLayer.setScale(2.0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.waterLayer.setCollisionByProperty({
            drown: true
        });

        this.farmGroundLayer.setCollisionByProperty({
            collides: true
        });

        this.smoothness = 0;

        // Coins setup
        this.coins = this.physics.add.group();

        this.coin1 = this.physics.add.sprite(game.config.width/4, game.config.height/8, 'movingCoin').setScale(SCALE);
        this.coins.add(this.coin1);
        this.coin2 = this.physics.add.sprite((game.config.width*39)/32, game.config.height/8, 'movingCoin').setScale(SCALE);
        this.coins.add(this.coin2);
        this.coin3 = this.physics.add.sprite(game.config.width*2.525, game.config.height*3/4, 'movingCoin').setScale(SCALE);
        this.coins.add(this.coin3);

        this.coin1Collected = false;
        this.coin2Collected = false;
        this.coin3Collected = false;

        // Flag end goal
        this.flag = this.physics.add.sprite((game.config.width*3)-160, game.config.height/8, 'flag', 0);
        this.flag.setScale(SCALE);
        this.flag.flipX = true;

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(game.config.width/4, game.config.height/2, "platformer_characters", "tile_0021.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);

        // Particle movement
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['symbol_01.png', 'smoke_03.png'],
            addrandom: true,
            scale: {start: 0.03, end: 0.05},
            maxAliveParticles: 100,
            lifespan: 4000,
            alpha: {start: 0.8, end: 0.1}, 
        });

        my.vfx.walking.stop();

        my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.waterLayer, this.drown);
        this.physics.add.collider(my.sprite.player, this.farmGroundLayer);
        this.physics.add.collider(this.coins, this.groundLayer);
        this.physics.add.collider(this.flag, this.farmGroundLayer);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.drawDebug = false;

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        this.physics.add.overlap(my.sprite.player, this.coin1, (obj1, obj2) => {
            obj2.destroy();
            coinCount++;
            this.coin1Collected = true;
            console.log(coinCount);
        });

        this.physics.add.overlap(my.sprite.player, this.coin2, (obj1, obj2) => {
            obj2.destroy();
            coinCount++;
            this.coin2Collected = true;
            console.log(coinCount);
        });

        this.physics.add.overlap(my.sprite.player, this.coin3, (obj1, obj2) => {
            obj2.destroy();
            coinCount++;
            this.coin3Collected = true;
            console.log(coinCount);
        });

        this.physics.add.overlap(my.sprite.player, this.flag, () => {
            this.scene.start("gameoverScene");
        });
    }

    update() {
        if(cursors.left.isDown) {
            // TODO: have the player accelerate to the left
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

            if(this.smoothness < 0){
                this.smoothness += 4;
            }
            if(this.smoothness < 200){    
                this.smoothness += 1;
                this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25, this.smoothness, 0);
            }

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else if(cursors.right.isDown) {
            // TODO: have the player accelerate to the right
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);

            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

            if(this.smoothness > 0){
                this.smoothness -= 4;
            }
            if(this.smoothness > -200){    
                this.smoothness -= 1;
                this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25, this.smoothness, 0);
            }

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else {
            // TODO: set acceleration to 0 and have DRAG take over
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);

            my.sprite.player.anims.play('idle');

            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

        }

        if (my.sprite.player.y > game.config.height + 100) {
            this.drown();
        }

        if (this.coin1Collected == false) {
            this.coin1.anims.play('movingCoin', true);
        }
        if (this.coin2Collected == false) {
            this.coin2.anims.play('movingCoin', true);
        }
        if (this.coin3Collected == false) {
            this.coin3.anims.play('movingCoin', true);
        }

        this.flag.anims.play('movingFlag', true);
    }

    drown() {  
        my.sprite.player.body.x = game.config.width/4;
        my.sprite.player.body.y = game.config.height/2;
    }

    finish(){
        this.scene.start("win");
    }

    collectItem(player, collectible) {
        collectible.destroy();
        coinCount++;
    }
}