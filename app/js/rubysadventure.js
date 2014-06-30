var Game = function(channel) {
  /* Variables */
  var window_width = 3000;
  var window_height = $(window).height();
  var map;
  var tileset;
  var layer;

  var facing = 'right';
  var jumpTimer = 0;

  this.player;
  this.cursors;
  this.crazyGhost;

  var jumpButton;
  var bg;
  var ground;
  var eventChannel = channel;
  this.game = new Phaser.Game(window_width, window_height, Phaser.AUTO, '', {
      preload: preload,
      create: create,
      update: update
  });
  var game = this.game;

  if (window_width < 1024) {
      window_width = 1024;
  }
  if (window_height < 720) {
      window_height = 720;
  }

  $(window).resize(function() { resizeGame(); } );
  function resizeGame() {
    var height = $(window).height();
    var width = $(window).width();

    game.width = width;
    game.height = height;
    game.stage.bounds.width = width;
    game.stage.bounds.height = height;

    if (game.renderType === Phaser.WEBGL)
    {
      game.renderer.resize(width, height);
    }
  }

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
    game.load.image('moneybag', 'images/moneybag.png');
    game.load.image('crazy-ghost', 'images/crazy-ghost.png');
  }

  function create() {
    setupBackgroundAndWorld();
    setupSprites();

    // The platforms group contains the ground and possibly other ledges
    platforms = game.add.group();

    // We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    setupGround();
    setupPlayer();
    // setupGems();
    // setupMoneyBag();

    game.eventChannel = {};
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

    crazyGhost = game.add.sprite(window_width * 0.4, game.world.height - 400, 'crazy-ghost');
    game.physics.enable(crazyGhost, Phaser.Physics.ARCADE);
    crazyGhost.body.immovable = true;
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
            var gem = gems.create((90 * i) + 250, 100, 'gem-active');
        } else {
            var gem = gems.create((90 * i) + 250, 100, 'gem-inactive');
        }
        gem.anchor.setTo(0.5, 0.5);
    }

    gems.fixedToCamera = true;
  }

  function setupMoneyBag() {
    chest = game.add.group();

    var bag = gems.create(100, 100, 'moneybag');
    bag.anchor.setTo(0.5, 0.5);

    chest.fixedToCamera = true;
  }

  /* x and y are percents of the width/height in decimal from the top left corner */

  function addSprite(game, sprite, x, y) {
    game.add.sprite(window_width * x, window_height * y, sprite);
  }

  function update() {
    game.physics.arcade.collide(player, ground);
    game.physics.arcade.collide(player, crazyGhost, function() {
      eventChannel.trigger('collision', [], ['Van Ghost','ruby']);
    }, null, this);

    player.body.velocity.x = 0;
    setupKeys();
  }

  function setupKeys() {
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

  function eventShow(params) {
    var allObjects
    var objsToShow = []
    for (index in params) {
        if (allObjects.indexOf(params[index]) != -1) {
            objsToShow.push(params[index])
        };
    }
    for (index in objsToShow) {
        show(objsToShow[index])
    }
  }

  function show(object) {
      //show
  }

  function eventSpeak(params) {
    var allDialogues
    for (index in allDialogues) {
      if (allDialogues[index].character == params[0]) {
        speak(allDialogues[index])
      };
    }
  }

  this.setupCollision = function() {
    game.physics.arcade.collide(player, crazyGhost, function() {
      console.log("COLLIDE");
    }, null, this);
  }

  function nextDialogue(characterName, dialogueArray, deleteDialogue) {
    var json = JSON.parse(dialogueArray)
    for (index in json) {
        if (json[index].character == characterName) {
            if (deleteDialogue) {
                delete json[index]
            };
            return json[index]
        }
    }
  }
}
