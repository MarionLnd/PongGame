game.control = {
    controlSystem: null,
    mousePointer: null,

    onKeyDown: function(event) {
        game.control.controlSystem = "KEYBOARD";
        // DESCENDRE
        if(event.code === game.keycode.KEYDOWNSTRING) {
            game.playerOne.goDown = true;
         // MONTER
        } else if(event.code === game.keycode.KEYUPSTRING) {
            game.playerOne.goUp = true;
        }
        if(event.code === game.keycode.SPACEBARSSTRING && !game.ball.inGame && game.gameOn) {
            game.ball.inGame = true;
            game.ball.posX = game.playerOne.posX + game.playerOne.width;
            game.ball.posY = game.playerOne.posY;
            game.ball.directionX = 1;
            game.ball.directionY = 1;
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
        game.control.controlSystem = "MOUSE";

        if(event){
            this.mousePointer = event.clientY;
        }

        if(this.mousePointer > game.playerOne.posY) {
            game.playerOne.goDown = true;
            game.playerOne.goUp = false;
        } else if(this.mousePointer < game.playerOne.posY) {
            game.playerOne.goDown = false;
            game.playerOne.goUp = true;
        } else {
            game.playerOne.goDown = false;
            game.playerOne.goUp = false;
        }
    },

    onStartGameClickButton: function() {
        if(!game.gameOn) {
            game.reinitGame();
            game.gameOn = true;
        }
    }
};