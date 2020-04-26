let game = {
    groundColor: "#000000",
    netColor: "#FFFFFF",

    devResX: 1920,
    devResY: 1080,
    targetResX: null,
    targetResY: null,
    ratioResX: null,
    ratioResY: null,

    groundLayer: null,
    scoreLayer: null,
    playersBallLayer: null,

    wallSound: null,
    playerSound: null,

    divGame: null,

    gameOn: false,
    startGameButton: null,
    controlMouseButton: null,
    controlKeyboardButton: null,

    players: [],
    tests: {},

    winner: "",
    loser: "",

    socket: null,
    ball: null,

    /*ball: {
        sprite: null,
        color: "#FFFFFF",
        speed: 1,
        directionX: 1,
        directionY: 1,
        inGame: false,

        move: function() {
            if(this.inGame) {
                this.sprite.posX += this.directionX * this.speed;
                this.sprite.posY += this.directionY * this.speed;
            }
        },

        bounce: function(soundToPlay) {
            if(this.sprite.posX > game.conf.GROUNDLAYERWIDTH || this.sprite.posX < 0){
                this.directionX = -this.directionX;
                soundToPlay.play();
            }
            if(this.sprite.posY + this.sprite.height > game.conf.GROUNDLAYERHEIGHT || this.sprite.posY < 0) {
                this.directionY = -this.directionY;
                soundToPlay.play();
            }
        },

        collide: function(anotherItem) {
            return !(this.sprite.posX >= anotherItem.posX + anotherItem.width || this.sprite.posX <= anotherItem.posX - anotherItem.width
                || this.sprite.posY >= anotherItem.posY + anotherItem.height || this.sprite.posY <= anotherItem.posY - anotherItem.height);
        },

        lost: function(player) {
            let returnValue = false;
            if(player.originalPosition === "left" && this.sprite.posX < (player.sprite.posX - this.sprite.width)) {
                returnValue = true;
            } else if(player.originalPosition === "right" && this.sprite.posX > (player.sprite.posX + player.sprite.width)) {
                returnValue = true;
            }
            return returnValue;
        },

        speedUp: function() {
            this.speed = this.speed + .1;
        },
    },*/

    playerOne: {
        sprite: null,
        color: "#FFFFFF",
        goUp: false,
        goDown: false,
        originalPosition: "left",
        score: 0,
        winner: false,
    },

    playerTwo: {
        sprite: null,
        color: "#FFFFFF",
        goUp: false,
        goDown: false,
        originalPosition: "right",
        score: 0,
        winner: false,
    },

    init: function () {
        this.socket = io.connect("http://localhost:2222");

        this.divGame = document.getElementById("divGame");
        // Terrain
        this.groundLayer = game.display.createLayer("terrain", game.conf.GROUNDLAYERWIDTH, game.conf.GROUNDLAYERHEIGHT, this.divGame, 0, "#000000", 0, 0);
        game.display.drawRectangleInLayer(this.groundLayer, game.conf.NETWIDTH, game.conf.GROUNDLAYERHEIGHT, this.netColor, game.conf.GROUNDLAYERWIDTH/2 - game.conf.NETWIDTH/2, 0);
        // Score
        this.scoreLayer = game.display.createLayer("score", game.conf.GROUNDLAYERWIDTH, game.conf.GROUNDLAYERHEIGHT, this.divGame, 1, undefined, 0, 0);
        // Raquette
        this.playersBallLayer = game.display.createLayer("joueurSetBalle", game.conf.GROUNDLAYERWIDTH, game.conf.GROUNDLAYERHEIGHT, this.divGame, 2, undefined, 0, 0);

        this.displayScore(0, 0);

        this.startGameButton = document.getElementById("startGame");
        this.controlMouseButton = document.getElementById("controlMouse");
        this.controlKeyboardButton = document.getElementById("controlKeyboard");

        this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);
        this.initMouse(game.control.onMouseMove);
        this.initStartGameClickButton();
        this.initControlMouseClickButton();
        this.initControlKeyboardClickButton();

        this.wallSound = new Audio("./sound/pingMur.ogg");
        this.playerSound = new Audio("./sound/pingRaquette.ogg");

        this.socket.on('players list', (list, ball) => {
            this.players = list;
            this.ball = ball;
            this.tests = list;
        });

        //this.speedUpBall();
    },

    displayScore: function(scorePlayer1, scorePlayer2) {
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, game.conf.SCOREFONTSIZE + "pt DS-DIGII", "#FFFFFF", game.conf.SCOREPOSXPLAYER1, game.conf.SCOREPOSYPLAYER1);
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, game.conf.SCOREFONTSIZE + "pt DS-DIGII", "#FFFFFF", game.conf.SCOREPOSXPLAYER2, game.conf.SCOREPOSYPLAYER2);
    },

    displayBall: function() {
        if(this.ball !== null) {
            game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
        }
    },

    displayPlayer: function() {
        this.players.forEach(({width, height, posX, posY, color}) => {
            game.display.drawRectangleInLayer(this.playersBallLayer, width, height, color, posX, posY);
        });
    },

    displayWinner: function() {
        // si le winner est a droite, player 2 ;si le winner est a gauche, player 1
        game.display.drawTextInLayer(this.playersBallLayer, 'Le gagnant est ' + game.winner, '25pt Arial', "#00BE19", 75,game.conf.GROUNDLAYERHEIGHT/2)
    },

    moveBall: function () {
        if(this.ball !== null){
            if(this.ball.inGame) {
                console.log(this.players)
                this.socket.emit('ball move');
                this.socket.emit('ball bounce', this.wallSound);
                this.displayBall();
            }
        }
    },

    movePlayers: function() {
        let up;
        let down;

        if (game.control.controlSystem === "KEYBOARD") {
            this.players.forEach((player) => {
                if(player.id === this.socket.id){
                    if(player.goUp) {
                        up = true;
                        down = false;
                    } else if(player.goDown) {
                        up = false;
                        down = true;
                    }
                }
            });
        } else if (game.control.controlSystem === "MOUSE") {
            this.players.forEach((player) => {
                if(player.id === this.socket.id){
                    if(player.goUp && player.posY > game.control.mousePointer) {
                        up = true;
                        down = false;
                    } else if(player.goDown && player.posY < game.control.mousePointer) {
                        up = false;
                        down = true;
                    }
                }
            });
        }

        this.players.forEach((player) => {
            if (up && player.posY > 0){
                this.socket.emit('move up');
            } else if (down && player.posY < (400 - player.height)){
                this.socket.emit('move down');
            }
        });
    },

    // TODO: Modifier en fonction des joueurs connectés
    collideBallWithPlayersAndAction: function() {
        let p1; // left
        let p2; // right
        let counter = 0;
        if(this.ball !== null) {
            if(this.ball.inGame) {
                this.players.forEach((player) => {
                    if(player.originalPosition === "left"){
                        p1 = player;
                        counter++;
                    } else {
                        p2 = player;
                        counter++;
                    }

                    console.log(counter);
                });
                console.log(counter);
                if(p1 !== undefined) {
                    if(!(this.ball.posX >= p1.posX + p1.width || this.ball.posX <= p1.posX - p1.width || this.ball.posY >= p1.posY + p1.height || this.ball.posY <= p1.posY - p1.height)) {
                        console.log(p1);
                        this.changeBallPath(p1, this.ball);
                        this.playerSound.play();
                    }
                }
                if(p2 !== undefined) {
                    if(!(this.ball.posX >= p2.posX + p2.width || this.ball.posX <= p2.posX - p2.width || this.ball.posY >= p2.posY + p2.height || this.ball.posY <= p2.posY - p2.height)) {
                        console.log(p2);
                        this.changeBallPath(p2, this.ball);
                        this.playerSound.play();
                    }
                }
            }
        }
    },

    lost: function(player) {
        let returnValue = false;
        if(player.originalPosition === "left" && this.ball.posX < (player.sprite.posX - this.ball.width)) {
            returnValue = true;
        } else if(player.originalPosition === "right" && this.ball.posX > (player.sprite.posX + player.sprite.width)) {
            returnValue = true;
        }
        return returnValue;
    },

    lostBall: function() {
        let p1; // left
        let p2; // right
        if(this.ball !== undefined && this.players !== undefined) {
            this.players.forEach((player) => {
                if(player.originalPosition === "left"){
                    p1 = player;
                } else {
                    p2 = player;
                }
            });
            /* if(this.ball.lost(p1)) {
                 //this.playerTwo.score++;
                 if(this.playerTwo.score === 2) {
                     this.gameOn = false;
                     game.ball.inGame = false;
                    // this.playerTwo.winner = true;
                     this.winner = "Player TWO";
                 } else {
                     this.ball.inGame = false;
                 }
           }/* else if(this.ball.lost(this.playerTwo)) {
                 //this.playerOne.score++;
                 if(this.playerOne.score === 9) {
                     //this.gameOn = false;
                     game.ball.inGame = false;
                    // this.playerOne.winner = true;
                     this.winner = "Player ONE";
                 } else {
                     this.ball.inGame = false;
                 }
             }*/
        }
        this.scoreLayer.clear();
        this.displayScore(this.playerOne.score, this.playerTwo.score);
    },

    ballOnPlayer: function(player, ball) {
        let returnValue = "CENTER";
        if(player !== undefined) {
            let playerPositions = player.height/5;
            if(ball !== undefined) {
                if(ball.posY > player.posY && ball.posY < (player.posY + playerPositions)) {
                    returnValue = "TOP";
                } else if(ball.posY >= (player.posY + playerPositions) && ball.posY < (player.posY + playerPositions*2)) {
                    returnValue = "MIDDLETOP";
                } else if (ball.posY >= (player.posY + playerPositions*2) && ball.posY < (player.posY + player.height - playerPositions)) {
                    returnValue = "MIDDLEBOTTOM";
                } else if (ball.posY >= (player.posY + player.height - playerPositions) && ball.posY < (player.posY + player.height)) {
                    returnValue = "BOTTOM";
                }
            }
        }
        return returnValue;
    },

    changeBallPath: function(player, ball) {
        if(player !== undefined) {
            if (ball !== undefined) {
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
                    switch (game.ballOnPlayer(player, ball)) {
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
            }
        }
    },

    speedUpBall: function() {
        setInterval(() => {
            this.socket.emit('ball speed up');
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

    initScreenRes: function() {
      this.targetResX = window.screen.availWidth;
      this.targetResY = window.screen.availHeight;
      this.ratioResX = this.targetResX/this.devResX;
      this.ratioResY = this.targetResY/this.devResY;
    },

    resizeDisplayData: function(object, ratioX, ratioY) {
        for(let property in object) {
            if ( property.match(/^.*X.*$/i) || property.match(/^.*WIDTH.*$/i) ) {
                object[property] = Math.round(object[property] * ratioX);
            } else {
                object[property] = Math.round(object[property] * ratioY);
            }
        }
    },

    initKeyboard: function(onKeyDownFunction, onKeyUpFunction) {
        window.onkeydown = onKeyDownFunction;
        window.onkeyup = onKeyUpFunction;
    },

    initMouse: function(onMouseMoveFunction) {
        window.onmousemove = onMouseMoveFunction;
    },

    initStartGameClickButton: function() {
        this.startGameButton.onclick = game.control.onStartGameClickButton;
    },

    initControlMouseClickButton: function() {
        this.controlMouseButton.onclick = game.control.onMouseControlClickButton;
    },

    initControlKeyboardClickButton: function() {
        this.controlKeyboardButton.onclick = game.control.onKeyboardControlClickButton;
    },
};
