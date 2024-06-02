class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 500;
        this.DRAG = 1500;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -700;
    }

    create() {
        this.physics.world.setBounds(0,0, 18*80*3, 40*18*3);
        this.cameras.main.setBounds(0,0,18*80*3, 40*18*3);

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
        this.farmGroundLayer = this.map.createLayer("Farm-Ground-n-Platforms", this.tilesetFarm, 0, 0);
        this.farmGroundLayer.setScale(2.0);
        this.farmOverlapLayer = this.map.createLayer("Farm-Overlap", this.tilesetFarm, 0, 0);
        this.farmOverlapLayer.setScale(2.0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.farmGroundLayer.setCollisionByProperty({
            collides: true
        });

        this.smoothness = 0;

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(game.config.width/4, game.config.height/2, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

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

        } else {
            // TODO: set acceleration to 0 and have DRAG take over
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);

            my.sprite.player.anims.play('idle');
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
    }
}