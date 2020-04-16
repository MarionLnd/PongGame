game.control = {
    controlSystem: null,
    mousePointer: null,

    onKeyDown: function(event) {
        if(game.control.controlSystem === "KEYBOARD") {
            if(event.code === game.keycode.KEYDOWNSTRING) {
                game.playerOne.goDown = true
            } else if(event.code === game.keycode.KEYUPSTRING) {
                game.playerOne.goUp = true;
            }
            if(event.code === game.keycode.SPACEBARSSTRING && !game.ball.inGame && game.gameOn) {
                //event.preventDefault();
                game.ball.inGame = true;
                game.ball.sprite.posX = game.playerOne.sprite.posX + game.playerOne.sprite.width;
                game.ball.sprite.posY = game.playerOne.sprite.posY;
                game.ball.directionX = 1;
                game.ball.directionY = 1;
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
        if(game.control.controlSystem === "MOUSE") {
            if(event){
                game.control.mousePointer = event.clientY;
            }

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
        }
    },

    onStartGameClickButton: function() {
        console.log(game.control.controlSystem);
        if(!game.gameOn &&game.control.controlSystem !== null) {
            game.reinitGame();
            game.gameOn = true;
            game.ball.inGame = true;
            game.ball.sprite.posX = game.playerOne.sprite.posX + game.playerOne.sprite.width;
            game.ball.sprite.posY = game.playerOne.sprite.posY;
            game.ball.directionX = 1;
            game.ball.directionY = 1;
        }
    },

    onMouseControlClickButton: function() {
        game.control.controlSystem = "MOUSE";
    },

    onKeyboardControlClickButton: function() {
        game.control.controlSystem = "KEYBOARD";
    }
};