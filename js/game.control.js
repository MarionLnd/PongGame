game.control = {
    controlSystem: null,
    mousePointer: null,

    onKeyDown: function(event) {
        if(game.control.controlSystem === "KEYBOARD") {
            if(event.code === game.keycode.KEYDOWNSTRING) {
                game.playerOne.goDown = true;
                if(game.onlineMode) {
                    game.socket.emit('moveDown');
                }
            } else if(event.code === game.keycode.KEYUPSTRING) {
                game.playerOne.goUp = true;
                if(game.onlineMode) {
                    game.socket.emit('moveUp');
                }
            }
        }
        if(event.code === game.keycode.SPACEBARSSTRING && !game.ball.inGame && game.gameOn) {
            game.ball.inGame = true;
            game.ball.sprite.posX = game.playerOne.sprite.posX + game.playerOne.sprite.width;
            game.ball.sprite.posY = game.playerOne.sprite.posY;
            game.ball.directionX = 1;
            game.ball.directionY = 1;
            if(game.onlineMode) {
                game.socket.emit('launchBall');
            }
        }
    },

    onKeyUp: function(event) {
        if(event.code === game.keycode.KEYUPSTRING) {
            game.playerOne.goDown = false;
        } else if(event.code === game.keycode.KEYDOWNSTRING) {
            game.playerOne.goUp = false;
        }
    },

    onMouseMove: function(event) {
        if(game.control.controlSystem === "MOUSE" && game.gameOn) {
            console.log(event.clientY);
            console.log(event.clientY - game.conf.MOUSECORRECTIONPOSY);
            if(event){
                game.control.mousePointer = event.clientY - game.conf.MOUSECORRECTIONPOSY;
            }
            if(game.control.mousePointer > game.playerOne.sprite.posY) {
                game.playerOne.goDown = true;
                game.playerOne.goUp = false;
                if(game.onlineMode) {
                    game.socket.emit('moveDown');
                }
            } else if(game.control.mousePointer < game.playerOne.sprite.posY) {
                game.playerOne.goDown = false;
                game.playerOne.goUp = true;
                if(game.onlineMode) {
                    game.socket.emit('moveUp');
                }
            } else {
                game.playerOne.goDown = false;
                game.playerOne.goUp = true;
            }
        }
    },

    onStartGameClickButton: function() {
        if(!game.gameOn && game.control.controlSystem !== null && game.iaMode) {
            game.reinitGame();
            game.gameOn = true;
            game.ball.inGame = true;
            game.ball.sprite.posX = game.playerOne.sprite.posX + game.playerOne.sprite.width;
            game.ball.sprite.posY = game.playerOne.sprite.posY;
            game.ball.directionX = 1;
            game.ball.directionY = 1;
        }
        if (!game.gameOn && game.control.controlSystem !== null && game.onlineMode) {
            game.socket = io.connect("http://localhost:2222");

            let data = {
                id: '_' + Math.random().toString(36).substr(2, 5),
                player: game.playerOne
            };
            console.log(data);
            //game.socket.emit('startGame', data);

            game.socket.emit('newPlayer', data);
            document.getElementById("description").style.display = 'none';
            document.getElementById("menuMode").style.display = 'none';
            document.getElementById("menuControl").style.display = 'none';
        }
    },

    onMouseControlClickButton: function() {
        game.control.controlSystem = "MOUSE";
    },

    onKeyboardControlClickButton: function() {
        game.control.controlSystem = "KEYBOARD";
    },

    onIAClickButton: function() {
        if(!game.ball.inGame) {
            game.iaMode = true;
            game.onlineMode = false;
            game.playerOne.ai = false;
            game.playerTwo.ai = true;
        }
    },

    onMultiplayerClickButton: function() {
        if(!game.ball.inGame) {
            game.iaMode = false;
            game.onlineMode = true;
            game.playerOne.ai = false;
            game.playerTwo.ai = false;
        }
    }
};