var window_width = $(window).width();
var window_height = $(window).height();

if (window_width < 1024) {
  window_width = 1024;
}
if (window_height < 720) {
  window_height = 720;
}

var game = new Phaser.Game(window_width, window_height, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  //load image and json files
  game.load.image('background', 'images/background.jpg');
  game.load.spritesheet('robot', 'images/robot.png', 130, 302, 7);
  game.load.image('birds', 'images/birds.png');
  game.load.image('cloud1', 'images/cloud-1.png');
  game.load.image('cloud2', 'images/cloud-2.png');
  game.load.image('spaceship', 'images/spaceship.png');
  game.load.image('gem-inactive', 'images/gem-inactive.png');
  game.load.image('gem-active', 'images/gem-active.png');
  game.load.image('sun', 'images/sun.png');
  game.load.image('ground', 'images/bar.png');
}

/* Variables */
var map;
var tileset;
var layer;
var player;
var facing = 'right';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var ground;

function create() {
  setupBackgroundAndWorld();
  setupSprites();

  // The platforms group contains the ground and possibly other ledges
  platforms = game.add.group();

  // We will enable physics for any object that is created in this group
  platforms.enableBody = true;

  setupGround();
  setupPlayer();
  setupGems();

  // Bind inputs
  cursors = game.input.keyboard.createCursorKeys();
  }

  function setupBackgroundAndWorld() {
  // Enabled Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // Make the world larger than the actual canvas
  game.world.setBounds(0, 0, window_width * 2, window_height);

  //Print images on canvas
  bg = game.add.tileSprite(0, 0, window_width, window_height, 'background');
  bg.fixedToCamera = true;
}

function setupSprites() {
  addSprite(game, 'sun', 0.5, 0.65);

  for (var i = 0; i < 3; i++) {
    addSprite(game, 'cloud1', -0.05 + i, randomHeightPercent(0.0, 0.3));
    addSprite(game, 'cloud2', 0.6 + i, randomHeightPercent(0.5, 0.7));
    addSprite(game, 'birds', 0.48 + i, Math.random());
  }

  game.add.sprite(window_width * 0.8, game.world.height - 380, 'spaceship');
}

function setupGround() {
  // Here we create the ground.
  ground = platforms.create(0, game.world.height - 64, 'ground');
  game.physics.enable(ground, Phaser.Physics.ARCADE);

  // Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.scale.setTo(2, 2);

  // This stops it from falling away when you jump on it
  ground.body.immovable = true;
}

function setupPlayer() {
  player = game.add.sprite(0.6, 600, 'robot');
  game.physics.enable(player, Phaser.Physics.ARCADE);

  player.body.gravity.set(0, 360);
  player.body.bounce.y = 0.2;
  player.body.collideWorldBounds = true;
  player.body.setSize(130, 302);
  player.body.collideWorldBounds = true;

  player.animations.add('left', [2, 1, 0], 30, true);
  player.animations.add('right', [5, 6, 7], 30, true);

  //console.log(game.camera.deadzone);
  game.camera.follow(player);
  game.camera.deadzone = new Phaser.Rectangle(window_width / 0.5, 0, window_width, window_height);

  //Camera stuff
  player.anchor.setTo(0, 1.5);
  game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
}

function setupGems() {
  gems = game.add.group();

  for (var i = 0; i < 5; i++) {
    if (i < 3) {
      var gem = gems.create((window_width * 0.68) - 400 + (90 * i), 50, 'gem-active');
    } else {
      var gem = gems.create((window_width * 0.68) - 400 + (90 * i), 50, 'gem-inactive');
    }
    gem.anchor.setTo(0.5, 0.5);
  }

  gems.fixedToCamera = true;
}

/* x and y are percents of the width/height in decimal from the top left corner */

function addSprite(game, sprite, x, y) {
  game.add.sprite(window_width * x, window_height * y, sprite);
}

function update() {
  game.physics.arcade.collide(player, ground);
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    player.body.velocity.x = -300;

    if (facing != 'left') {
      player.animations.play('left');
      facing = 'left';
    }
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 300;

    if (facing != 'right') {
      player.animations.play('right');
      facing = 'right';
    }
  }
  if (cursors.up.isDown && playerCanJump() && game.time.now > jumpTimer) {
    player.body.velocity.y = -250;
    jumpTimer = game.time.now + 750;
  }
  if (!(cursors.up.isDown || cursors.right.isDown || cursors.left.isDown)) {
    if (facing != 'idle') {
      player.animations.stop();

      if (facing == 'left') {
        player.frame = 3;
      } else {
        player.frame = 4;
      }
      facing = 'idle';
    }
  }

}

function randomHeightPercent(lower, higher) {
  var number = Math.random();
  while (number < lower || number > higher) {
    if (number < lower) {
      number = number + lower;
    }
    if (number > higher) {
      number = number - higher
    }
  }
  return number;
}

function playerCanJump() {
  var h = ground.position.y;
  var p = player.position.y - 151;

  return ((p + 0.5) > h && h > (p - 0.5));
}
