var game = new Phaser.Game($(window).width(), $(window).height(), Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    //load image and json files
    game.load.image('background', 'images/background.jpg');
    game.load.spritesheet('robot', 'images/robot.png', 130, 302, 7);
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
var ground;

function create() {
    //Enabled Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Print images on canvas

    bg = game.add.tileSprite(0, 0, $(window).width(), $(window).height(), 'background');
    bg.fixedToCamera = true;
<<<<<<< HEAD
    game.add.sprite(400, 419, 'spaceship');
    game.add.sprite(-100, 100, 'cloud1');

    game.add.sprite(750, 520, 'sun');

    game.add.sprite(900, 378, 'cloud2');

    game.add.sprite(650, 50, 'birds');
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
 
    // Enables physics for any object that is created in this group
=======

    addSprite(game, 'spaceship', 0.1, 0.2);
    addSprite(game, 'cloud1', 0.3, 0.4);
    addSprite(game, 'cloud2', 0.6, 0.1);

    // The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    // We will enable physics for any object that is created in this group
>>>>>>> b76a09239a04e6d2691b9172863b1aeded0efc1c
    platforms.enableBody = true;

    // Here we create the ground.
<<<<<<< HEAD
    ground = platforms.create(0, game.world.height - 64, 'ground');
    game.physics.enable(ground, Phaser.Physics.ARCADE);

=======
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    // Scale it to fit the width of the game (the original sprite is 400x32 in size)
>>>>>>> b76a09239a04e6d2691b9172863b1aeded0efc1c
    ground.scale.setTo(2, 2);

    // This stops it from falling away when you jump on it
    ground.body.immovable = true;
<<<<<<< HEAD
    
=======

>>>>>>> b76a09239a04e6d2691b9172863b1aeded0efc1c
    player = game.add.sprite(32, 32, 'robot');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.gravity.set(0, 360);
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(130, 302);

    player.body.collideWorldBounds = true;

    player.animations.add('left', [3, 2, 1], 30, true);
    //player.animations.add('turn', [4], 30, true);
    player.animations.add('right', [5, 6, 7], 30, true);
    game.camera.follow(player);

    //bind inputs
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

/* x and y are percents of the width/height in decimal from the top left corner */
function addSprite(game, sprite, x, y)
{
  game.add.sprite($(window).width()*x, $(window).height()*y, sprite);
}

function update() {

    game.physics.arcade.collide(player, ground);

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
                player.frame = 3;
            }
            else
            {
                player.frame = 4;
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
