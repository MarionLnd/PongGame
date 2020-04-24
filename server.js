const app = require('./bin/express')();
const socket = require('socket.io');
const path = require('path');
let connections = [];

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname + '\\pong.html'));
    res.status(200);
});

let server = app.listen(2222);
console.log("Running on port 2222");
let counterConnections = 0;

let io = socket(server);
let currentGame = {
    players: {},
};

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log("Une connection: " + socket.id);
    socket.emit('message', 'Vous etes bien connecte!');

    socket.on('newPlayer', (data) => {
        console.log("on new player");
        currentGame.players[socket.id] = data.player;
        counterConnections++;
        console.log("counter on new player: " + counterConnections);

        if(currentGame.players.length === 2) {
            console.log()
        }
        if(connections.length === 1) {
            currentGame.players[socket.id].originalPosition = "left";
        }
        if(connections.length === 2) {
            currentGame.players[socket.id].originalPosition = "right";
        }
        console.log(currentGame);
    });

    socket.on('startGame', (data) => {
        console.log("Un utilisateur est connecté: " + socket.id + ", nombre de connexions: " + connections.length);
        if(connections.length === 1) {
            currentGame.playerOne = data.player;
        }
        if(connections.length === 2){
            currentGame.playerTwo = data.player;
            // LA PARTIE PEUT COMMENCER
        }
    });

    socket.on('gameState', function(data) {
        console.log("in gameState event");
        console.log(data);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
        connections.pop();
        delete currentGame.players[socket.id];
        if(counterConnections < 0) {
            counterConnections = 0
        } else {
            counterConnections--;
        }

        console.log("counter after disconnection: " + counterConnections);
    });
});

// Emets infos jeu 60 fois par secondes
setInterval(() => {
    io.volatile.emit('state', currentGame);
}, 1000/60);

