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
    },

    onKeyUp: function(event) {
        //game.controlSystem = "KEYBOARD";
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
};