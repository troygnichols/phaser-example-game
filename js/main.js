var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;

function preload() {
  console.log("preload()");

  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', '/assets/star.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function create() {
  console.log("create()");

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0,0, 'sky');

  platforms = game.add.group();

  // enable physics for any object created in this group
  platforms.enableBody = true;

  var ground = platforms.create(0, game.world.height-64, 'ground');
  ground.scale.setTo(2, 2);
  ground.body.immovable = true;

  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;

  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;

  player = game.add.sprite(32, game.world.height-150, 'dude');

  // start facing right;
  player.animations.frame = 5;
  game.physics.arcade.enable(player);

  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  player.animations.add('left', [0,1,2,3], 10, true);
  player.animations.add('right', [5,6,7,8], 10, true);

  cursors = game.input.keyboard.createCursorKeys();

  stars = game.add.group();
  stars.enableBody = true;

  for (var i=0; i < 1; i++) {
    var star = stars.create(i*70, 0, 'star');
    star.body.gravity.y = 100;
    star.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

  scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(stars, platforms);

  decelerate(player, 20);

  var leftRightVelocity = 150;

  if (cursors.left.isDown) {
    player.body.velocity.x = -leftRightVelocity;
    if (player.body.touching.down) {
      player.animations.play('left');
    } else {
      player.animations.frame = 3;
    }
  }  else if (cursors.right.isDown) {
    player.body.velocity.x = leftRightVelocity;
    if (player.body.touching.down) {
      player.animations.play('right');
    } else {
      player.animations.frame = 8;
    }
  } else {
    player.animations.stop();
    if (player.animations.frame > 4) {
      player.animations.frame = 5;
    } else {
      player.animations.frame = 0;
    }
  }

  // can jump if on the ground
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -350;
    player.animations.stop();
  }

  game.physics.arcade.overlap(player, stars, collectStar, null, this);
}

function collectStar(player, star) {
  star.kill();

  score += 10;
  scoreText.text = 'Score: ' + score;

  if (stars.countLiving() === 0) {
    document.body.innerHTML =
      '<center style="color: #fff"><h1>YOU WON</h1><p>good job stars are all gone now</p></center>';
  }
}

function decelerate(player, rate) {
  if (!rate) {
    player.body.velocity.x = 0;
    return
  }
  var v = player.body.velocity.x;
  if (v > 0) {
    v = Math.max(0,  v - rate);
  } else {
    v = Math.min(0,  v + rate);
  }
  player.body.velocity.x = v;
}
