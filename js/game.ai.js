game.ai =  {
    player: null,
    ball: null,

    setPlayerAndBall: function(player, ball) {
        this.player = player;
        this.ball = ball;
    },

    move: function() {
        if(this.ball.directionX === 1) {
            if(this.player.originalPosition === "right") {
                this.followBall();
            }
            if(this.player.originalPosition === "left") {
                this.goCenter();
            }
        } else {
            if(this.player.originalPosition === "right") {
                this.goCenter();
            }
            if(this.player.originalPosition === "left") {
                this.followBall();
            }
        }
    },

    followBall: function() {
        if(this.ball.posY > this.player.posY + this.player.height/2) {
            this.player.posY--;
        } else if(this.ball.posY < this.player.posY + this.player.height/2) {
            this.player.posY++;
        }
    },

    goCenter: function() {
        if(this.player.posY + this.player.height/2 > game.groundHeight/2) {
            this.player.posY--;
        } else if (this.player.posY + this.player.height/2 < game.groundHeight/2) {
            this.player.posY++;
        }
    }
};