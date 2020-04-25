game.control = {
    controlSystem: null,
    mousePointer: null,
    socket: game.socket,

    // TODO: Modifier en fonction du joueur connecté
    onKeyDown: function(event) {
        if(game.control.controlSystem === "KEYBOARD") {
            if(event.code === game.keycode.KEYDOWNSTRING) {
                game.playerOne.goDown = true;
                if(game.onlineMode) {
                    socket.emit('move down');
                }
            } else if(event.code === game.keycode.KEYUPSTRING) {
                game.playerOne.goUp = true;
                if(game.onlineMode) {
                    socket.emit('move up');
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
                socket.emit('launchBall');
            }
        }
    },

    // TODO: Modifier en fonction du joueur connecté
    onKeyUp: function(event) {
        if(event.code === game.keycode.KEYUPSTRING) {
            game.playerOne.goDown = false;
        } else if(event.code === game.keycode.KEYDOWNSTRING) {
            game.playerOne.goUp = false;
        }
    },

    // TODO: Modifier en fonction du joueur connecté
    onMouseMove: function(event) {
        if(game.control.controlSystem === "MOUSE" && game.gameOn) {
            if(event){
                game.control.mousePointer = event.clientY - game.conf.MOUSECORRECTIONPOSY;
            }
            if(game.control.mousePointer > game.playerOne.sprite.posY) {
                game.playerOne.goDown = true;
                game.playerOne.goUp = false;
                if(game.onlineMode) {
                    socket.emit('move down');
                }
            } else if(game.control.mousePointer < game.playerOne.sprite.posY) {
                game.playerOne.goDown = false;
                game.playerOne.goUp = true;
                if(game.onlineMode) {
                    socket.emit('move up');
                }
            } else {
                game.playerOne.goDown = false;
                game.playerOne.goUp = true;
            }
        }
    },

    //
    onStartGameClickButton: function() {
        if(!game.gameOn && game.control.controlSystem !== null) {
            game.reinitGame();
            game.gameOn = true;
            game.ball.inGame = true;
            game.ball.sprite.posX = game.playerOne.sprite.posX + game.playerOne.sprite.width;
            game.ball.sprite.posY = game.playerOne.sprite.posY;
            game.ball.directionX = 1;
            game.ball.directionY = 1;
            socket.emit('start game');
        }
        /*if (!game.gameOn && game.control.controlSystem !== null) {
            game.socket = io.connect("http://localhost:2222");

            let data = {
                id: '_' + Math.random().toString(36).substr(2, 5),
                player: game.playerOne
            };
            console.log(data);
            //game.socket.emit('startGame', data);

            socket.emit('newPlayer', data);
            document.getElementById("description").style.display = 'none';
            document.getElementById("menuMode").style.display = 'none';
            document.getElementById("menuControl").style.display = 'none';
        }*/
    },

    onMouseControlClickButton: function() {
        game.control.controlSystem = "MOUSE";
    },

    onKeyboardControlClickButton: function() {
        game.control.controlSystem = "KEYBOARD";
    },
};