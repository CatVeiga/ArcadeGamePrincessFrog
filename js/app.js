//TODO: create a timer function (my timer does not work)
//TODO: create a grab function for it's easier to reach the points
//TODO: create a different sound for different stage the game (hit, die, win, grab...)

//──── global variables ──────────────────────────────────────────────────────────────────
const liveContainer = document.querySelector(".lives");
let lives = 3;
const scoreContainer = document.querySelector(".score");
let score = 0;
const play = document.getElementById("audio");
let oldsrc = play.src;

//========================================================================================
/*                                                                                      *
 *                              modal for the instructions                              *
 *                                                                                      */
//========================================================================================
const modalInst = document.getElementById("modalinst");
const btnInst = document.getElementById("btn-inst");
const close = document.getElementById("close");

btnInst.onclick = function() {
    modalInst.style.display = "block";
}

close.onclick = function() {
    modalInst.style.display = "none";
}
//when user clicks anywhere outside the modal it closes
window.onclick = function() {
    if(event.target == modalInst) {
        modalInst.style.display = "none";
    }
}

//========================================================================================
/*                                                                                      *
 *                                    Enemys function                                   *
 *                                                                                      */
//========================================================================================
//──── the enemies we must avoid ─────────────────────────────────────────────────────────
var Enemy = function(x, y, speed) {
    //defining the exact location where enemies should be and the speed
    this.x = x;
    this.y = y;
    this.speed = speed;
    //the image we will use to set our enemies
    this.sprite = 'images/enemy-car.png';
};

//──── update the position with parameter: dt ────────────────────────────────────────────
Enemy.prototype.update = function(dt) {
    //we will multiply the speed
    this.x += this.speed * dt;
    //we will ensure that the game runs at the same time for all computers
    if(this.x > 510) {
        this.x = -50;
        this.speed = 100 + Math.floor(Math.random() * 200);
    }
    //when the player hit on the enemy it should return to the start position
    if(player.x < this.x + 80 && 
		player.x + 80 > this.x && 
		player.y < this.y + 60 && 
		60 + player.y > this.y) {
            //reset the position
            player.reset();
            //decrease lives
            lives--;
            if(lives == 0) {
                //shows the over modal
                loseGame();
                //game restart
                restart();
                //clear the timer
                //clearInterval(interval);

            }
        }
};

//──── draw the Enemy on the screen ──────────────────────────────────────────────────────
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//========================================================================================
/*                                                                                      *
 *                             function to restart the game                             *
 *                                                                                      */
//========================================================================================
function restart() {
    //reset the player position
    player.reset();
    //reset the lives 
    lives = 3;
    // reset the score 
    score = 0;
    //clear the time
    //clearInterval(interval);
}

//========================================================================================
/*                                                                                      *
 *                                   function to timer                                  *
 *                                                                                      */
//========================================================================================
/*let timer = document.querySelector("#timer");
*let seconds = 60;
*
function startTime() {
*    
*    const interval = setTimeout(function(){
*        timer.innerHTML = seconds;
*        seconds--;
*        if(seconds = 0){
*           loseGame();
*            seconds = 60;
*        }
*    }, 1000);
*}
*/
//========================================================================================
/*                                                                                      *
 *                              modal box for over the game                             *
 *                                                                                      */
//========================================================================================
const modalOver = document.querySelector("#modalOver");
const btnOver = document.querySelector("#btn-over");

function loseGame() {
    if(lives === 0){
        modalOver.style.display = "block";
        play.src = "";
        restart();
    }
    btnOver.onclick = function() {
        modalOver.style.display = "none";
        
    }
}

//========================================================================================
/*                                                                                      *
 *                              modal box for win the game                              *
 *                                                                                      */
//========================================================================================
const modalWin = document.querySelector("#modalWin");
const btnWin = document.querySelector("#btn-win");

function winGame() {
    if(scores === 1600) {
        modalWin.style.display = "block";
        play.src = "";
    }
    btnWin.onclick = function() {
        modalWin.style.display = "none";
        restart();
    }
}

//========================================================================================
/*                                                                                      *
 *                                    Player Function                                   *
 *                                                                                      */
//========================================================================================
//──── setting the player, location ──────────────────────────────────────────────────────
var Player = function(x, y) {
    //defining the location where the player will start
    this.x = x;
    this.y = y;
    //the image will we use to set the player
    this.player = 'images/Design.png';    
}

//──── update the player Position ────────────────────────────────────────────────────────
Player.prototype.update = function(dt) {
    //show the lives 
    liveContainer.innerHTML = `${lives}`;
    //shows the score in the game
    scoreContainer.innerHTML = `${score}`;
}

//──── draw the player in the screen ─────────────────────────────────────────────────────
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.player), this.x, this.y);
}

//──── reseting the player to the start position ─────────────────────────────────────────
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 405;
}

//──── using the handleinput to keypress ─────────────────────────────────────────────────
Player.prototype.handleInput = function(keyPress) {
    if(keyPress == 'up' && this.y > 0) {
        this.y -= 83;
    }
    if(keyPress == 'down' && this.y < 405) {
        this.y += 83;
    }
    if(keyPress == 'left' && this.x > 0) {
		this.x -= 102;
    }
    if (keyPress == 'right' && this.x < 405) {
		this.x += 102;
    }
    if (this.y < 0) {
		setTimeout(function() {
            //when the player reaches the water he will reset to start position
			player.x = 202;
            player.y = 405;
            //increase at the same time the score to 100 points
			score += 100;
		}, 100);
	}
}

//========================================================================================
/*                                                                                      *
 *                             Iniatilization of our objects                            *
 *                                                                                      */
//========================================================================================
//──── Place all enemies in array called allEnemies ──────────────────────────────────────
var allEnemies = [];

//──── set all enemies to the exact position ─────────────────────────────────────────────
var enemyPosition = [63, 147, 230];

enemyPosition.forEach(function(positionY) {
	enemy = new Enemy(0, positionY, 200);
	allEnemies.push(enemy);
});

//──── put the player object in a variable called player ─────────────────────────────────
let player = new Player(202, 405);

//──── This listens for key presses and sends the keys to your ───────────────────────────
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});