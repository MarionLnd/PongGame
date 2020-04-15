let game = {
    groundWidth: 700,
    groundHeight: 400,
    groundColor: "#000000",
    netWidth: 6,
    netColor: "#FFFFFF",

    groundLayer: null,
    scoreLayer: null,
    playersBallLayer: null,

    scorePosPlayer1: 300,
    scorePosPlayer2: 365,

    wallSound: null,
    playerSound: null,

    divGame: null,

    gameOn: false,
    startGameButton: null,

    ball: {
        sprite: null,
        color: "#FFFFFF",
        directionX: 1,
        directionY: 1,
        speed: 1,
        inGame: false,

        move: function() {
            if(this.inGame) {
                this.posX += this.directionX * this.speed;
                this.posY += this.directionY * this.speed;
            }
        },

        bounce: function(soundToPlay) {
            if(this.posX > game.groundWidth || this.posX < 0){
                this.directionX = -this.directionX;
                soundToPlay.play();
            }
            if(this.posY > game.groundHeight || this.posY < 0) {
                this.directionY = -this.directionY;
                soundToPlay.play();
            }
        },

        collide: function(anotherItem) {
            return !(this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX - anotherItem.width
                || this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY - anotherItem.height);
        },

        lost: function(player) {
            let returnValue = false;
            if(player.originalPosition === "left" && this.posX < player.posX - this.width) {
                returnValue = true;
            } else if(player.originalPosition === "right" && this.posX > player.posX + player.width) {
                returnValue = true;
            }
            return returnValue;
        },

        speedUp: function() {
            this.speed = this.speed + .1;
        },
    },

    playerOne: {
        sprite: null,
        color: "#FFFFFF",
        goUp: false,
        goDown: false,
        originalPosition: "left",
        score: 0,
        ai: false,
    },

    playerTwo: {
        sprite: null,
        color: "#FFFFFF",
        goUp: false,
        goDown: false,
        originalPosition: "right",
        score: 0,
        ai: true,
    },

    init: function () {
        this.divGame = document.getElementById("divGame");
        // Terrain
        //this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, document.getElementById("divGame"), 0, "#000000", 0, 0);
        this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, this.divGame, 0, "#000000", 0, 0);
        game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);

        // Score
        this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, this.divGame, 1, undefined, 0, 0);
        //game.display.drawTextInLayer(this.scoreLayer, "SCORE", "10px Arial", "#FF0000", 10, 10);

        // Raquette
        this.playersBallLayer = game.display.createLayer("joueurSetBalle", this.groundWidth, this.groundHeight, this.divGame, 2, undefined, 0, 0);
        //game.display.drawTextInLayer(this.playersBallLayer, "JOUEURSETBALLE", "10px Arial", "#FF0000", 100, 100);

        this.displayScore(0,0);

        this.ball.sprite = game.display.createSprite(10,10, 200, 200, "./img/ball.png");
        this.displayBall();

        this.playerOne.sprite = game.display.createSprite(15,70, 30, 200, "./img/playerOne.png");
        this.playerTwo.sprite = game.display.createSprite(15,70, 650, 200, "./img/playerTwo.png");
        this.displayPlayers();

        this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);
        this.initMouse(game.control.onMouseMove);
        //this.initStartGameClickButton();

        this.wallSound = new Audio("./sound/pingMur.ogg");
        this.playerSound = new Audio("./sound/pingRaquette.ogg");

        game.ai.setPlayerAndBall(this.playerTwo, this.ball);

        this.speedUpBall();
    },

    displayScore: function(scorePlayer1, scorePlayer2) {
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px DS-DIGII", "#FFFFFF", this.scorePosPlayer1, 55);
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px DS-DIGII", "#FFFFFF", this.scorePosPlayer2, 55);
    },

    displayBall: function() {
        game.display.drawImageInLayer(this.playersBallLayer, this.ball.sprite.img, this.ball.sprite.posX, this.ball.sprite.posY);
    },

    displayPlayers: function() {
        game.display.drawImageInLayer(this.playersBallLayer, this.playerOne.sprite.img, this.playerOne.sprite.posX, this.playerOne.sprite.posY);
        game.display.drawImageInLayer(this.playersBallLayer, this.playerTwo.sprite.img, this.playerTwo.sprite.posX, this.playerTwo.sprite.posY);
    },

    moveBall: function () {
        this.ball.move();
        this.ball.bounce(this.wallSound);
        this.displayBall();
    },

    movePlayers: function() {
        if (game.control.controlSystem === "KEYBOARD") {
            // keyboard control
            if (game.playerOne.goUp && game.playerOne.sprite.posY > 0) {
                game.playerOne.sprite.posY-=5;
            } else if (game.playerOne.goDown && game.playerOne.sprite.posY < game.groundHeight - game.playerOne.sprite.height) {
                game.playerOne.sprite.posY+=5;
            }
        } else if (game.control.controlSystem === "MOUSE") {
            // mouse control
            if (game.playerOne.goUp && game.playerOne.sprite.posY > game.control.mousePointer) {
                game.playerOne.sprite.posY-=5;
            } else if (game.playerOne.goDown && game.playerOne.sprite.posY < game.control.mousePointer) {
                game.playerOne.sprite.posY+=5;
            }
        }
    },

    collideBallWithPlayersAndAction: function() {
        if(this.ball.collide(this.playerOne)) {
            this.changeBallPath(game.playerOne.sprite, game.ball.sprite);
            this.playerSound.play();
        }
        if(this.ball.collide(this.playerTwo)) {
            this.changeBallPath(game.playerTwo.sprite, game.ball.sprite);
            this.playerSound.play();
        }
    },

    lostBall: function() {
        if(this.ball.lost(this.playerOne)) {
            this.playerTwo.score++;
            if(this.playerTwo.score > 9) {
                this.gameOn = false;
            } else {
                this.ball.inGame = false;
                if(this.playerOne.ai) {
                    setTimeout(game.ai.startBall(), 3000);
                }
            }
        } else if(this.ball.lost(this.playerTwo)) {
            this.playerOne.score++;
            if(this.playerOne.score > 9) {
                this.gameOn = false;
            } else {
                this.ball.inGame = false;
                if(this.playerTwo.ai) {
                    setTimeout(game.ai.startBall(), 3000);
                }
            }
        }
        this.scoreLayer.clear();
        this.displayScore(this.playerOne.score, this.playerTwo.score);
    },

    ballOnPlayer: function(player, ball) {
        let returnValue = "CENTER";
        let playerPositions = player.height/5;

        if(ball.posY > player.posY && ball.posY < player.posY + playerPositions) {
            returnValue = "TOP";
        } else if(ball.posY >= player.posY + playerPositions && ball.posY < player.posY + playerPositions*2) {
            returnValue = "MIDDLETOP";
        } else if (ball.posY >= player.posY + playerPositions*2 && ball.posY < player.posY +
            player.height - playerPositions) {
            returnValue = "MIDDLEBOTTOM";
        } else if (ball.posY >= player.posY + player.height - playerPositions && ball.posY < player.posY +
            player.height) {
            returnValue = "BOTTOM";
        }
        return returnValue;
    },

    changeBallPath: function(player, ball) {
        if (player.originalPosition === "left" ) {
            switch(game.ballOnPlayer(player, ball)) {
                case "TOP":
                    ball.directionX = 1;
                    ball.directionY = -3;
                    break;
                case "MIDDLETOP":
                    ball.directionX = 1;
                    ball.directionY = -1;
                    break;
                case "CENTER":
                    ball.directionX = 2;
                    ball.directionY = 0;
                    break;
                case "MIDDLEBOTTOM":
                    ball.directionX = 1;
                    ball.directionY = 1;
                    break;
                case "BOTTOM":
                    ball.directionX = 1;
                    ball.directionY = 3;
                    break;
            }
        } else {
            switch(game.ballOnPlayer(player, ball)) {
                case "TOP":
                    ball.directionX = -1;
                    ball.directionY = -3;
                    break;
                case "MIDDLETOP":
                    ball.directionX = -1;
                    ball.directionY = -1;
                    break;
                case "CENTER":
                    ball.directionX = -2;
                    ball.directionY = 0;
                    break;
                case "MIDDLEBOTTOM":
                    ball.directionX = -1;
                    ball.directionY = 1;
                    break;
                case "BOTTOM":
                    ball.directionX = -1;
                    ball.directionY = 3;
                    break;
            }
        }
    },

    speedUpBall: function() {
        setInterval(() => {
            game.ball.speedUp();
        }, 5000);
    },

    reinitGame: function() {
        this.ball.inGame = false;
        this.ball.speed = 1;
        this.playerOne.score = 0;
        this.playerTwo.score = 0;
        this.scoreLayer.clear();
        this.displayScore(this.playerOne.score, this.playerTwo.score);
    },

    clearLayer: function(targetLayer) {
        targetLayer.clear();
    },

    initKeyboard: function(onKeyDownFunction, onKeyUpFunction) {
        window.onkeydown = onKeyDownFunction;
        window.onkeyup = onKeyUpFunction;
    },

    initMouse: function(onMouseMoveFunction) {
        window.onmousemove = onMouseMoveFunction;
    },

    initStartGameClickButton: function() {
        this.startGameButton.onclick = game.control.onStartGameClickButton();
    }
};