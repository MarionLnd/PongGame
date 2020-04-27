game.control = {
    controlSystem: null,
    mousePointer: null,

    onKeyDown: function(event) {
        if(game.control.controlSystem === "KEYBOARD") {
            if(event.code === game.keycode.KEYDOWNSTRING) {
                game.playerOne.goDown = true;
                if(game.onlineMode) {
                    if(game.socket !== null) {
                        game.socket.emit('key down arrow down');
                    }
                }
            } else if(event.code === game.keycode.KEYUPSTRING) {
                game.playerOne.goUp = true;
                if(game.onlineMode) {
                    if(game.socket !== null) {
                        game.socket.emit('key down arrow up');
                    }
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
                if(game.socket !== null) {
                    game.socket.emit('launch ball');
                }
            }
        }
    },

    onKeyUp: function(event) {
        if(event.code === game.keycode.KEYUPSTRING) {
            game.playerOne.goDown = false;
            if(game.onlineMode) {
                if(game.socket !== null) {
                    game.socket.emit('key up arrow up');
                }
            }
        } else if(event.code === game.keycode.KEYDOWNSTRING) {
            game.playerOne.goUp = false;
            if(game.onlineMode) {
                if(game.socket !== null) {
                    game.socket.emit('key up arrow down');
                }
            }
        }
    },

    onMouseMove: function(event) {
        if(game.control.controlSystem === "MOUSE" && game.gameOn) {
            console.log(event.clientY);
            console.log(event.clientY - game.conf.MOUSECORRECTIONPOSY);
            if(event){
                game.control.mousePointer = event.clientY - game.conf.MOUSECORRECTIONPOSY;
            }
            if(game.iaMode) {
                if(game.control.mousePointer > game.playerOne.sprite.posY) {
                    game.playerOne.goDown = true;
                    game.playerOne.goUp = false;
                } else if(game.control.mousePointer < game.playerOne.sprite.posY) {
                    game.playerOne.goDown = false;
                    game.playerOne.goUp = true;
                } else {
                    game.playerOne.goDown = false;
                    game.playerOne.goUp = true;
                }
            } else if(game.onlineMode) {
                if(game.onlinePlayers !== null) {
                    game.onlinePlayers.forEach((player) => {
                        if(game.control.mousePointer > player.posY) {
                            if(game.socket !== null) {
                                game.socket.emit('mouse move down');
                            }
                        } else if(game.control.mousePointer < player.posY) {
                            if(game.socket !== null) {
                                game.socket.emit('mouse move up');
                            }
                        } else {
                            player.goDown = false;
                            player.goUp = true;
                        }
                    })
                }
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
            game.socket.emit('start game');
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
            game.socket.emit('change mode disconnection');
        }
    },

    onMultiplayerClickButton: function() {
        if(!game.ball.inGame) {
            game.iaMode = false;
            game.onlineMode = true;
            game.playerOne.ai = false;
            game.playerTwo.ai = false;
            if(game.socket.socket !== undefined) {
                game.socket.socket.connect();
            }
        }
    }
};