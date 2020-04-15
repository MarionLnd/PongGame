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

    ball: {
        width: 10,
        height: 10,
        color: "#FFFFFF",
        posX: 200,
        posY: 200,
        speed: 1,
        directionX: 1,
        directionY: 1,

        move: function() {
            this.posX += this.directionX * this.speed;
            this.posY += this.directionY * this.speed;
        },

        bounce: function(soundToPlay) {
            //console.log(soundToPlay.play());
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
        }
    },

    playerOne: {
        width: 10,
        height: 50,
        color: "#FFFFFF",
        posX: 10,
        posY: 200,
        goUp: false,
        goDown: false,
        originalPosition: "left"
    },

    playerTwo: {
        width: 10,
        height: 50,
        color: "#FFFFFF",
        posX: 680,
        posY: 200,
        goUp: false,
        goDown: false,
        originalPosition: "right"
    },

    init: function () {
        this.divGame = document.getElementById("divGame");
        // Terrain
        //this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, document.getElementById("divTerrain"), 0, "#000000", 0, 0);
        this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, this.divGame, 0, "#000000", 0, 0);
        game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);

        // Score
        this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, this.divGame, 1, undefined, 0, 0)
        game.display.drawTextInLayer(this.scoreLayer, "SCORE", "10px Arial", "#FF0000", 10, 10);

        // Raquette
        this.playersBallLayer = game.display.createLayer("joueurSetBalle", this.groundWidth, this.groundHeight, this.divGame, 2, undefined, 0, 0)
        game.display.drawTextInLayer(this.playersBallLayer, "JOUEURSETBALLE", "10px Arial", "#FF0000", 100, 100);

        this.displayScore(0,0);
        this.displayBall();
        //this.displayPlayers();

        this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);
        this.initMouse(game.control.onMouseMove);

        this.wallSound = new Audio("./sound/pingMur.ogg");
        this.playerSound = new Audio("./sound/pingRaquette.ogg");
        game.ai.setPlayerAndBall(this.playerTwo, this.ball);
    },

    displayScore: function(scorePlayer1, scorePlayer2) {
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
    },

    displayBall: function() {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
    },

    displayPlayers: function() {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
    },

    moveBall: function () {
        this.ball.move();
        this.ball.bounce(this.wallSound);
        this.displayBall();
    },

    movePlayers: function() {
        if (game.control.controlSystem === "KEYBOARD") {
            // keyboard control
            if (game.playerOne.goUp && game.playerOne.posY > 0) {
                game.playerOne.posY-=5;
            } else if (game.playerOne.goDown && game.playerOne.posY < game.groundHeight - game.playerOne.height) {
                game.playerOne.posY+=5;
            }
        } else if (game.control.controlSystem === "MOUSE") {
            // mouse control
            if (game.playerOne.goUp && game.playerOne.posY > game.control.mousePointer) {
                game.playerOne.posY-=5;
            } else if (game.playerOne.goDown && game.playerOne.posY < game.control.mousePointer) {
                game.playerOne.posY+=5;
            }
        }
    },

    collideBallWithPlayersAndAction: function() {
        if(this.ball.collide(this.playerOne)) {
            game.ball.directionX = -game.ball.directionX;
            this.playerSound.play();
        }
        if(this.ball.collide(this.playerTwo)) {
            game.ball.directionX = -game.ball.directionX;
            this.playerSound.play();
        }
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
    }
};