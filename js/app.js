"use strict";
//========================================================================================
/*                                                                                      *
 *                              modal for the instructions                              *
 *                                                                                      */
//========================================================================================
const close = document.querySelector("#close");
const modalInst = document.querySelector("#modalinst");

close.addEventListener("click", function(){
    modalInst.style.display = "none"; 
    startTime(); 
});
//========================================================================================
/*                                                                                      *
 *                              function to init the timer                              *
 *                                                                                      */
//========================================================================================
const timeContainer = document.querySelector("#timer");
const modalOver = document.querySelector("#modalOver");
const modalWin = document.querySelector("#modalWin");
let seconds = 0;
let totalTime = 120;

function newFunction() {
    const backsound = document.createElement("backsound");
    backsound.playbackRate = 0.3;
    backsound.setAttribute('src', 'audio/FroggerMainSongTheme(loop).mp3');
}

function startTime(){
    timeContainer.innerHTML = totalTime - seconds + `(s)`;
    const interval = setInterval(initTime, 1000);

    function initTime() {
        seconds++;
        timeContainer.innerHTML = totalTime - seconds + `(s)`;
        //if the seconds was equal to totalTime
        if(seconds == totalTime) {
            //player will reset the position
            player.x = 202;
            player.y = 405;
            //shows the modal
            modalOver.style.display = "block";
            //clears the timer
            clearInterval(interval);
            seconds = 0;
            firstMove = false;
        }

        //if the user reaches 1600 points 
        if(score == 1600) {
            // resets the player position
            player.x = 202;
            player.y = 405;
            //shows the modal
            modalWin.style.display = "block";
            //clears the timer
            clearInterval(interval);
            seconds = 0;
            firstMove = false;
        }

        // if the user loses all the lives
        if (lives == 0) {
            //resets the player position
            player.x = 202;
            player.y = 405;
            //show thwe modal
            modalOver.style.display = "block";
            clearInterval(interval);
            seconds = 0;
            firstMove = false;
        }
    }
}
//========================================================================================
/*                                                                                      *
 *                               function to init the game                              *
 *                                                                                      */
//========================================================================================
const liveContainer = document.querySelector(".lives");
let lives;
const scoreContainer = document.querySelector(".score");
let score;
let firstMove;

function initGame() {
    lives = 3;
    score = 0;
    firstMove = true;
    liveContainer.innerHTML = lives;
    scoreContainer.innerHTML = score;
    timeContainer.innerHTML = totalTime + `(s)`;
};

initGame();
//========================================================================================
/*                                                                                      *
 *                                   events listeners                                   *
 *                                                                                      */
//========================================================================================
const btnOver = document.querySelector("#btn-over");
const btnWin = document.querySelector("#btn-win");

btnOver.addEventListener("click", function(){
    modalOver.style.display = "none";
    initGame();
    startTime();
});

btnWin.addEventListener("click", function(){
    modalWin.style.display = "none";
    initGame();
    startTime();
});
//========================================================================================
/*                                                                                      *
 *                                    Enemys function                                   *
 *                                                                                      */
//========================================================================================
//──── the enemies we must avoid ─────────────────────────────────────────────────────────
class Enemy {
    constructor(x, y, speed) {
        //defining the exact location where enemies should be and the speed
        this.x = x;
        this.y = y;
        this.speed = speed;
        //the image we will use to set our enemies
        this.sprite = 'images/enemy-car.png';
    }
    //──── update the position with parameter: dt ────────────────────────────────────────────
    update(dt) {
        this.render();
        //we will multiply the speed
        this.x += this.speed * dt;
        //we will ensure that the game runs at the same time for all computers
        if (this.x > 510) {
            this.x = -50;
            this.speed = 100 + Math.floor(Math.random() * 200);
        }
      //when the player colide with the enemys check for collisions
      checkCollisions();
    }
    //──── draw the Enemy on the screen ──────────────────────────────────────────────────────
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

function checkCollisions () {
    allEnemies.forEach(function(enemy){
        if((player.x < enemy.x + 80 &&
            player.x + 55 > enemy.x) &&
            (player.y < enemy.y + 60 &&
            player.y + 60 > enemy.y)) {
                player.x = 202;
                player.y = 405;
                lives--;
                liveContainer.innerHTML = lives;
            }
    });
}
//========================================================================================
/*                                                                                      *
 *                                    Player Function                                   *
 *                                                                                      */
//========================================================================================
//──── setting the player, location ──────────────────────────────────────────────────────
class Player {
    constructor(x, y) {
        //defining the location where the player will start
        this.x = x;
        this.y = y;
        //the image will we use to set the player
        this.sprite = 'images/Design.png';
    }
    //──── update the player Position ────────────────────────────────────────────────────────
    update(dt) {
        this.render();
    }
    //──── draw the player in the screen ─────────────────────────────────────────────────────
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    //──── using the handleinput to keypress ─────────────────────────────────────────────────
    handleInput(keyPress) {
        if (keyPress == 'up' && this.y > 0) {
            this.y -= 83;
        }
        if (keyPress == 'down' && this.y < 405) {
            this.y += 83;
        }
        if (keyPress == 'left' && this.x > 0) {
            this.x -= 102;
        }
        if (keyPress == 'right' && this.x < 405) {
            this.x += 102;
        }
        if (this.y < 0) {
            setTimeout(function(){
            //reset the player position
            player.x = 202;
            player.y = 405;
            //increase the score 
            score += 100;
            scoreContainer.innerHTML = score;
            }, 100);
        }
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
    if(firstMove){
        player.handleInput(allowedKeys[e.keyCode]);
    }    
});