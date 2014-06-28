var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
 
function preload() {
    game.load.image('sky', 'sky.png');
    game.load.image('ground', 'platform.png');
    game.load.image('star', 'star.png');
    game.load.spritesheet('dude', 'dude.png', 32, 48);
}
 
function create() {
    game.add.sprite(0, 0, 'star');
}
 
function update() {
}