var game = new Phaser.Game(1100, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });
 
function preload() {
    //load image and json files 
    game.load.image('background', 'images/background.jpg');
    game.load.spritesheet('robot', 'images/robot.png', 130, 302, 4);
    game.load.image('birds', 'images/birds.png');
    game.load.image('cloud1', 'images/cloud-1.png');
    game.load.image('cloud2', 'images/cloud-2.png', 32, 48);
    game.load.image('spaceship', 'images/spaceship.png');
    game.load.image('sun', 'images/sun.png');
    game.load.image('ground', 'images/bar.png');   
}
 
/* Variables */
var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;

function create() {
    //Enabled Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Print images on canvas
    game.add.sprite(400, 419, 'spaceship');
    bg = game.add.tileSprite(0, 0, 1100, 800, 'background');
    bg.fixedToCamera = true;
    game.add.sprite(400, 419, 'spaceship');
    game.add.sprite(400, 419, 'cloud1');
    game.add.sprite(600, 419, 'cloud2');
    game.add.sprite(700, 519, 'sun');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
 
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
 
    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);
 
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
 
    player = game.add.sprite(32, 32, 'robot');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.gravity.set(0, 360);
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(130, 302);

    player.animations.add('right', [2], 10, true);

    game.camera.follow(player);

    //bind inputs
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}
 
function update() {

    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

}



function render () {

    game.debug.text(game.time.physicsElapsed, 32, 32);
    game.debug.body(player);
    game.debug.bodyInfo(player, 16, 24);

}
