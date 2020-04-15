game.ai =  {
    player: null,
    ball: null,

    setPlayerAndBall: function(player, ball) {
        this.player = player;
        this.ball = ball;
    },

    startBall: function() {
      if(this.player.originalPosition === "right") {
          this.ball.inGame = true;
          this.ball.sprite.posX = this.player.sprite.posX;
          this.ball.sprite.posY = this.player.sprite.posY;
          this.ball.directionX = -1;
          this.ball.directionY = 1;
      } else {
          this.ball.inGame = true;
          this.ball.sprite.posX = this.player.sprite.posX + this.player.sprite.width;
          this.ball.sprite.posY = this.player.sprite.posY;
          this.ball.directionX = 1;
          this.ball.directionY = 1;
      }
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
        if(this.ball.sprite.posY < this.player.sprite.posY + this.player.sprite.height/2) {
            this.player.sprite.posY--;
        } else if(this.ball.sprite.posY > this.player.sprite.posY + this.player.sprite.height/2) {
            this.player.sprite.posY++;
        }
    },

    goCenter: function() {
        if(this.player.sprite.posY + this.player.sprite.height/2 > game.groundHeight/2) {
            this.player.sprite.posY--;
        } else if (this.player.sprite.posY + this.player.sprite.height/2 < game.groundHeight/2) {
            this.player.sprite.posY++;
        }
    }
};