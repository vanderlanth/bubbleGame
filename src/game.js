// ----------------------------------- variables -----------------------------------


var Dot, Player;
var dots = [];
var players = [];
var scores = [];
var gameplay = document.getElementById('gameplay');
var start = document.querySelector('#start');
var end = document.querySelector('#end');
var keyControls = {
		'w': 87,
		's': 83,
		'a': 65,
		'd': 68,
		'up': 38,
		'down': 40,
		'left': 37,
		'right': 39
}


// ----------------------------------- objects & classes -----------------------------------


Dot = function() {
		this.element = document.createElement('div');
		this.element.classList.add("dot");
		this.color = 'yellow';
		this.posx = 0;
		this.posy = 0;
		this.size = 10;
		this.xSize;
		this.ySize;
};


Dot.prototype = {
		setColor: function(color) {
				this.color = color;
				this.element.style['background-color'] = color;
		},
		setPosition: function(posx, posy) {
				this.posx = posx;
				this.posy = posy;
				this.element.style.top = posy + 'px';
				this.element.style.left = posx + 'px';
				this.setPositionWithSize();
		},
		setPositionWithSize: function() {
				this.xSize = this.posx + this.size;
				this.ySize = this.posy + this.size;
		},
		dotSize: function(size) {
				this.size = size;
				this.element.style.width = size + 'px';
				this.element.style.height = size + 'px';
		},
		getElem: function() {
				return this.element;
		}
};


function newDots(amount, dotMinSize) {
	  var dot, i, j, size, top, left, hsl, player;
		for (i = 0; i < amount; i++) {

				top = random(20, window.innerHeight-20);
				left = random(20, window.innerWidth-20);
				size = random(dotMinSize, dotMinSize + i);
				hsl = random(0, 360);
			
				dot = new Dot();
				dot.dotSize(size);
				dot.setColor('hsl(' + hsl + ',90%,70%)');
				dot.setPosition(left, top);
				for(j in players){
					player= players[j];
					if(dot.posx < player.xSize &&
						 dot.xSize > player.posx &&
						 dot.posy < player.ySize &&
						 dot.ySize > player.posy) {
						 top = random(20, window.innerHeight-20);
						 left = random(20, window.innerWidth-20);
						 dot.setPosition(left, top);
					}
				}
				dots.push(dot);
				gameplay.appendChild(dot.getElem());
		};
}


Player = function(playerSize, leftPosition, topPosition, speed) {
		playerSize = playerSize || 8;
		topPosition = topPosition || window.innerHeight-20;
		leftPosition = leftPosition || window.innerWidth-20;
		speed = speed || 2;
		this.dot = new Dot();
		this.element = this.dot.getElem();
		this.element.classList.add('player');
		this.setPosition(this.movex, this.movey);
		this.playerSize(playerSize);
		this.dot.setColor('white');
		this.setSpeed(speed);
		this.movex = leftPosition;
		this.movey = topPosition;
		this.posx = 0;
		this.posy = 0;
		this.xSize;
		this.ySize;
		this.score = 0;
		this.controls = {
				up: false,
				down: false,
				left: false,
				right: false
		}
};


Player.prototype = {
		setPosition: function(posx, posy) {
				this.posx = posx;
				this.posy = posy;
				this.element.style.top = posy + 'px';
				this.element.style.left = posx + 'px';
				this.setPositionWithSize();
		},
		setPositionWithSize: function() {
				this.xSize = this.posx + this.size;
				this.ySize = this.posy + this.size;
		},
		setKeys: function(moveUp, moveDown, moveLeft, moveRight) {
				this.keyUp = keyControls[moveUp];
				this.keyDown = keyControls[moveDown];
				this.keyLeft = keyControls[moveLeft];
				this.keyRight = keyControls[moveRight];
		},
		setSpeed: function(speed) {
				this.speed = speed;
		},
	  playerSize: function(playerSize) {
				this.size = playerSize;
				this.element.style.width = playerSize + 'px';
				this.element.style.height = playerSize + 'px';
		}
};


function newPlayer(up, down, left, right, leftP, topP) {
		var player = new Player();
		players.push(player);
		player.movex = leftP;
	  player.movey = topP;
		player.setKeys(up, down, left, right);
		gameplay.appendChild(player.element);
};


// ----------------------------------- functions -----------------------------------


function random(min, max) {
		return Math.random() * (max - min) + min;
};


function move() {
		var i;
		for (i in players) {
				var moving = players[i];
				var adapt = Math.round(Math.sqrt(2) * 1000) / 1000;
				if (moving.controls.up && moving.controls.left) {
						moving.movey -= moving.speed / adapt;
						moving.movex -= moving.speed / adapt;
				} else if (moving.controls.up && moving.controls.right) {
						moving.movey -= moving.speed / adapt;
						moving.movex += moving.speed / adapt;
				} else if (moving.controls.down && moving.controls.left) {
						moving.movey += moving.speed / adapt;
						moving.movex -= moving.speed / adapt;
				} else if (moving.controls.down && moving.controls.right) {
						moving.movey += moving.speed / adapt;
						moving.movex += moving.speed / adapt;
				} else if (moving.controls.up) {
						moving.movey -= moving.speed;
				} else if (moving.controls.down) {
						moving.movey += moving.speed;
				} else if (moving.controls.left) {
						moving.movex -= moving.speed;
				} else if (moving.controls.right) {
						moving.movex += moving.speed;
				}
		}
};


function update() {
		var i;
		var windowx = (window.innerWidth);
		var windowy = (window.innerHeight);
		for (i in players) {
				var moving = players[i];
				if (moving.movex > window.innerWidth) {
						moving.movex -= window.innerWidth+moving.size;
				} else if (moving.movey > window.innerHeight) {
						moving.movey -= window.innerHeight+moving.size;
				} else if (moving.movex < 0-moving.size) {
						moving.movex += window.innerWidth+moving.size;
				} else if (moving.movey < 0-moving.size) {
						moving.movey += window.innerHeight+moving.size;
				}
				moving.setPosition(moving.movex, moving.movey);
		}
};


function isCollision() {
		var i, j, thisDot, player;
		for (i in dots) {
				thisDot = dots[i];
				for (j in players) {
						player = players[j];
						if (thisDot.posx < player.xSize &&
								thisDot.xSize > player.posx &&
								thisDot.posy < player.ySize &&
								thisDot.ySize > player.posy) {
								if (player.size > thisDot.size) {
										player.playerSize(player.size + (thisDot.size/3));
									  player.movex=player.movex-(player.size/thisDot.size);
									  player.movey=player.movey-(player.size/thisDot.size);
										gameplay.removeChild(thisDot.getElem());
										dots.splice(i, 1);
										newDots(1, random(player.size/3,player.size*1.05));
								} else {
										gameplay.removeChild(player.element);
										players.splice(j, 1);
								}
						}
				}
		}
};


function eatPlayer() {
		var playerOne = players[0];
		var playerTwo = players[1];
		if (players.length === 2) {
				if (playerOne.posx < playerTwo.xSize &&
						playerOne.xSize > playerTwo.posx &&
						playerOne.posy < playerTwo.ySize &&
						playerOne.ySize > playerTwo.posy) {
						if (playerOne.size > playerTwo.size) {
								playerOne.playerSize(playerOne.size + playerTwo.size);
								gameplay.removeChild(playerTwo.element);
								players.splice(playerTwo, 1);
						} else if (playerOne.size < playerTwo.size) {
								playerTwo.playerSize(playerTwo.size + playerOne.size);
								gameplay.removeChild(playerOne.element);
								players.splice(playerOne, 1);
						}
				}
		}
};


function getSmaller() {
		var i, player;
		for (i in players) {
				player = players[i];
				if (player.size > 20) {
						player.playerSize(player.size - (player.size * 0.003));
					  player.setSpeed(40/player.size);
					  console.log(player.speed);
				} else {
						break;
				}
		}
};
var resizingPlayer;


function resizePlayer() {
		resizingPlayer = setInterval(getSmaller, 100);
}
resizePlayer();


//------------------------------ UI --------------------------------------


function newGame(attr) {
	var howMany = attr;
	if (howMany == 1) {
		newPlayer('up', 'down', 'left', 'right', 20, 20);
		startTransition();
	} else if (howMany == 2) {
		newPlayer('up', 'down', 'left', 'right', 20, 20);
		newPlayer('w', 's', 'a', 'd', window.innerWidth-20, window.innerHeight-20);
		startTransition();
	}
	newDots(40, 5);
}


var leftTransition = 0;
var id;

function startTransition() {
		id = setInterval(function() {
				leftTransition -= (leftTransition - 100) * 0.05;
				leftTransition = leftTransition > 100 ? 100 : leftTransition;
				start.style.left = leftTransition + '%';
		}, 1);
};


function theend() {
		if (players.length === 0) {
				clearInterval(id);
				leftTransition -= leftTransition / 10;
				leftTransition = leftTransition < 0 ? 0 : leftTransition;
				end.style.left = leftTransition + '%';
		} else{
			  end.style.left = 100 + '%';
		}
};


// ----------------------------------- events -----------------------------------


start.addEventListener("click", newGame, false);


function keypress(type, keycode) {
		var i, isPress = (type === 'keydown');
	
		for (i in players) {
				if (keycode === players[i].keyUp) {
						players[i].controls.up = isPress;
				} else if (keycode === players[i].keyDown) {
						players[i].controls.down = isPress;
				} else if (keycode === players[i].keyRight) {
						players[i].controls.right = isPress;
				} else if (keycode === players[i].keyLeft) {
						players[i].controls.left = isPress;
				}
		}
}


window.addEventListener('keydown', function(e) {
		keypress('keydown', e.keyCode);
}, false);


window.addEventListener('keyup', function(e) {
		keypress('keyup', e.keyCode);
}, false);


function loop() {
		isCollision();
		eatPlayer();
		move();
		update();
		theend();
		requestAnimationFrame(loop);
};


loop();


// -------------------------- this is not a konami code --------------------------------


var Konami;

Konami = function(){
	this.table = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
	this.i = 0;
	this.reset = {};
	this.konami = function(){
		console.log("I'm in love with the coco");
		var i;
		for(i = 0; i < 2000; i++){
			newDots(40, 5);
		}
	};
}

var konami = new Konami();

window.addEventListener('keydown', function(event){
	if(event.keyCode === konami.table[konami.i]){
		if(konami.reset){
			clearInterval(konami.reset);
		}
		konami.reset = setInterval(function(){
			konami.i = 0;
		}, 2000);
		if(konami.i === 9){
			konami.konami();
		} else {
			konami.i++
		}
	}
	else{
		konami.i = 0;
	}
}, false);

