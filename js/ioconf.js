const socketio = require('socket.io');

module.exports = function(server) {
    const io = socketio(server);
    const players = {};
    const ball = {
        width: 10,
        height: 10,
        posX: 200,
        posY: 200,
        color: "#651651",
        speed: 1,
        directionX: 1,
        directionY: 1,
        inGame: false,
    };

    io.on('connection', (socket) => {
        console.log("A user is connected");

        players[socket.id] = {
            width: 0,
            height: 0,
            posX: 0,
            posY: 0,
            color: "#651651",
            goUp: false,
            goDown: false,
            originalPosition: 'left',
            score: 0,
            winner: false
        };

        if(Object.keys(players).length <= 1) {
            players[socket.id] = {
                width: 0,
                height: 0,
                posX: 0,
                posY: 0,
                color: "#516511",
                goUp: false,
                goDown: false,
                originalPosition: 'right',
                score: 0,
                winner: false
            };
        }

        console.log(Object.keys(players).length);
        console.log(players);

        // Start the game (by space key)
        socket.on('start game', () => {});

        // Players movements
        socket.on('move up', () => {players[socket.id].posY -= 4});
        socket.on('move down', () => {players[socket.id].posY += 4});

        // Ball movements
        socket.on('ball move', () => {
            if(ball.inGame) {
                ball.posX += ball.directionX * ball.speed;
                ball.posY += ball.directionY * ball.speed;
            }
        });
        socket.on('ball bounce', () => {
            if(ball.posX > game.conf.GROUNDLAYERWIDTH || ball.posX < 0){
                this.directionX = -this.directionX;
                soundToPlay.play();
            }
            if(ball.posY + ball.height > game.conf.GROUNDLAYERHEIGHT || ball.posY < 0) {
                this.directionY = -this.directionY;
                soundToPlay.play();
            }
        });
        socket.on('ball collide', () => {});
        socket.on('ball lose', () => {});
        socket.on('ball speed up', () => {});

        socket.on('start game', () => {});
        socket.on('start game', () => {});
        socket.on('start game', () => {});
        socket.on('start game', () => {});
        socket.on('start game', () => {});

        socket.on('disconnect', () => {
            console.log("A user has been disconnected");
            delete players[socket.id];
        });
    });

    function update() {
        io.volatile.emit('players list', Object.values(players));
    }

    setInterval(update, 1000/60);
};