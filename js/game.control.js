game.control = {
    controlSystem: null,
    mousePointer: null,

    onKeyDown: function(event) {
        if(game.control.controlSystem === "KEYBOARD") {
            if(event.code === game.keycode.KEYDOWNSTRING) {
                game.socket.emit('key down arrow down');
            } else if(event.code === game.keycode.KEYUPSTRING) {
                game.socket.emit('key down arrow up');
            }
        }
        if(event.code === game.keycode.SPACEBARSSTRING && !game.ball.inGame){// && game.gameOn) {
            game.socket.emit('launch ball');
        }
    },

    onKeyUp: function(event) {
        if(event.code === game.keycode.KEYUPSTRING) {
            game.socket.emit('key up arrow up');
        } else if(event.code === game.keycode.KEYDOWNSTRING) {
            game.socket.emit('key up arrow down');
        }
    },

    onMouseMove: function(event) {
        if(game.control.controlSystem === "MOUSE") {
            if(event){
                game.control.mousePointer = event.clientY - game.conf.MOUSECORRECTIONPOSY;
            }
            if(game.players !== null) {
                game.players.forEach((player) => {
                    if(game.control.mousePointer > player.posY) {
                        game.socket.emit('mouse move down');
                    } else if(game.control.mousePointer < player.posY) {
                        game.socket.emit('mouse move up');
                    } else {
                        player.goDown = false;
                        player.goUp = true;
                    }
                })
            }
        }
    },

    onStartGameClickButton: function() {
        game.socket.emit('start game');
    },

    onMouseControlClickButton: function() {
        game.control.controlSystem = "MOUSE";
    },

    onKeyboardControlClickButton: function() {
        game.control.controlSystem = "KEYBOARD";
    },
};