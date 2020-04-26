const socketio = require('socket.io');

module.exports = function(server) {
    const io = socketio(server);
    let gameState = {};
    gameState.gameOn = false;
    const players = {};
    const balls = [];
    let ball = {};

    io.on('connection', (socket) => {
        console.log("A user is connected: " + socket.id);
        console.log("players length: " + Object.keys(players).length);

        balls.push({
            id: socket.id,
            width: 10,
            height: 10,
            posX: 200,
            posY: 200,
            color: "#FFFFFF",
            speed: 1,
            directionX: 1,
            directionY: 1,
            inGame: false,
        });
        ball = balls[0];

        console.log(balls[0]);

        if(Object.keys(players).length === 0) {
            players[socket.id] = {
                id: socket.id,
                width: 10,
                height: 65,
                posX: 20,
                posY: 200,
                color: "#651651",
                goUp: false,
                goDown: false,
                originalPosition: 'left',
                score: 0,
                winner: false
            };
        }

        for(playerId in players) {
            //if(Object.keys(players).length === 1){// && Object.keys(players).length < 2) {
            if(Object.keys(players).length >= 0 && Object.keys(players).length < 2) {
                if (players[playerId].originalPosition === "left") {
                    players[socket.id] = {
                        id: socket.id,
                        width: 10,
                        height: 65,
                        posX: 670,
                        posY: 210,
                        color: "#"+((1<<24)*Math.random()|0).toString(16),
                        goUp: false,
                        goDown: false,
                        originalPosition: 'right',
                        score: 0,
                        winner: false
                    };
                } else {
                    players[socket.id] = {
                        id: socket.id,
                        width: 10,
                        height: 65,
                        posX: 20,
                        posY: 210,
                        color: "#"+((1<<24)*Math.random()|0).toString(16),
                        goUp: false,
                        goDown: false,
                        originalPosition: 'left',
                        score: 0,
                        winner: false
                    };
                }
            }
        }

        // Start the game (by clicking the button)
        socket.on('start game', () => {
            console.log("start game");

            if(ball !== null && players[socket.id] !== undefined) {
                if(Object.keys(players).length === 2) {
                    for(playerId in players) {
                        players[playerId].score = 0
                    }
                    gameState.gameOn = true;
                    if(players[socket.id] !== undefined) {
                        if(players[socket.id].originalPosition === "left"){
                            ball.inGame = true;
                            ball.posX = players[socket.id].posX + players[socket.id].width;
                            ball.posY = players[socket.id].posY;
                            ball.directionX = 1;
                            ball.directionY = 1;
                        } else {
                            ball.inGame = true;
                            ball.posX = players[socket.id].posX - players[socket.id].width;
                            ball.posY = players[socket.id].posY;
                            ball.directionX = -1;
                            ball.directionY = 1;
                        }
                    }
                }
            }
        });

        // Lancer/relancer la balle
        socket.on('launch ball', () => {
            if(ball !== null){// && !ball.inGame) {
                // GOOD
                if(players[socket.id] !== undefined) {
                    if(!ball.inGame){
                        if(players[socket.id].originalPosition === "left"){
                            ball.inGame = true;
                            ball.posX = players[socket.id].posX + players[socket.id].width;
                            ball.posY = players[socket.id].posY;
                            ball.directionX = 1;
                            ball.directionY = 1;
                        } else {
                            ball.inGame = true;
                            ball.posX = players[socket.id].posX - players[socket.id].width;
                            ball.posY = players[socket.id].posY;
                            ball.directionX = -1;
                            ball.directionY = 1;
                        }
                    }
                }
            }
        });

        // Players movements
        socket.on('move up', () => {
            if(players[socket.id] !== undefined){
                if(players[socket.id].posY > 0){
                    players[socket.id].posY -= 4;
                }
            }
        });
        socket.on('move down', () => {
            if(players[socket.id] !== undefined) {
                if(players[socket.id].posY < (400 - players[socket.id].height) ){
                    players[socket.id].posY += 4;
                }
            }
        });
        socket.on('key down arrow up', () => {
            if(players[socket.id] !== undefined){
                players[socket.id].goUp = true;
                players[socket.id].goDown = false;
            }
        });
        socket.on('key down arrow down', () => {
            if(players[socket.id] !== undefined){
                players[socket.id].goUp = false;
                players[socket.id].goDown = true;
            }
        });
        socket.on('key up arrow up', () => {
            if(players[socket.id] !== undefined){
                players[socket.id].goDown = false;
            }
        });
        socket.on('key up arrow down', () => {
            if(players[socket.id] !== undefined){
                players[socket.id].goUp = false;
            }
        });
        socket.on('mouse move up', () => {
            if(players[socket.id] !== undefined){
                players[socket.id].goUp = true;
                players[socket.id].goDown = false;
            }
        });
        socket.on('mouse move down', () => {
            if(players[socket.id] !== undefined){
                players[socket.id].goUp = false;
                players[socket.id].goDown = true;
            }
        });

        // Ball movements
        socket.on('ball move', () => {
            if(ball !== null) {
                if(ball.inGame) {
                    if(ball.posX < 700 || ball.posX > 0){
                        ball.posX += ball.directionX * ball.speed;
                    }
                    if(ball.posY + ball.height < 400 || ball.posY > 0) {
                        ball.posY += ball.directionY * ball.speed;
                    }
                }
            }
        });
        socket.on('ball bounce', (soundToPlay) => {
            //console.log(soundToPlay);
            if(ball !== undefined) {
                if(ball.posX > 700 || ball.posX < 0){
                    ball.directionX = -ball.directionX;
                }
                if(ball.posY + ball.height > 400 || ball.posY < 0) {
                    ball.directionY = -ball.directionY;
                }
            }
        });
        socket.on('ball collide', (anotherItem) => {
            if(ball !== null) {
                /*return !(ball.sprite.posX >= anotherItem.posX + anotherItem.width || ball.sprite.posX <= anotherItem.posX - anotherItem.width
                    || ball.sprite.posY >= anotherItem.posY + anotherItem.height || ball.sprite.posY <= anotherItem.posY - anotherItem.height);*/
                return !(ball.posX >= anotherItem.posX + anotherItem.width || ball.posX <= anotherItem.posX - anotherItem.width
                    || ball.posY >= anotherItem.posY + anotherItem.height || ball.posY <= anotherItem.posY - anotherItem.height);
            }
        });
        socket.on('ball lose', (player) => {
            let returnValue = false;
            if(ball !== null) {
                //if (player.originalPosition === "left" && ball.sprite.posX < (player.posX - ball.width)) {
                if (player.originalPosition === "left" && ball.posX < (player.posX - ball.width)) {
                    returnValue = true;
                //} else if (player.originalPosition === "right" && ball.sprite.posX > (player.posX + player.width)) {
                } else if (player.originalPosition === "right" && ball.posX > (player.posX + player.width)) {
                    returnValue = true;
                }
            }
            return returnValue;
        });
        socket.on('ball speed up', () => {
            if(ball !== null) {
                ball.speed = ball.speed + .1;
            }
        });



        gameState.players = players;
        gameState.players = ball;
        //console.log(gameState);

        /*
        socket.on('start game', () => {});
        socket.on('start game', () => {});
        socket.on('start game', () => {});
        socket.on('start game', () => {});
        */

        socket.on('disconnect', () => {
            console.log("A user has been disconnected: " + socket.id);
            delete players[socket.id];
            balls.pop();
            ball.inGame = false;
            console.log(players);
        });
    });

    function update() {
        io.volatile.emit('players list', Object.values(players), ball);
    }

    setInterval(update, 1000/60);
};