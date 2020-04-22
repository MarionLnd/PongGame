const express = require('express');
//const socket = require('socket.io');
const path = require('path');
const game = require('./js/game');
const ai = require('./js/game.ai');
const conf = require('./js/game.conf');
const control = require('./js/game.control');
const display = require('./js/game.display');
const keycode = require('./js/game.keycode');
//console.log(game);

/*
"js/game.js"
"js/game.display.js"
"js/game.control.js"
"js/game.keycode.js"
"js/game.ai.js"
"js/game.conf.js"
"server.js"
*/

let connections = [];

const app = express();
let server = app.listen(2222);
//app.use(express.static('js'));
console.log("RUNNING");

//console.log(path);

app.use('/', (req, res) => {
    //console.log(path);
    console.log(req.url);
    if(req.url ==! '/js/game.js' || req.url ==! '/js/game.display.js' || req.url ==! '/js/game.conf.js' || req.url ==! '/js/game.control.js' || req.url ==! '/js/game.keycode.js' || req.url ==! '/js/game.ai.js') {

    }
    res.sendFile(path.join(__dirname + '\\pong.html'));

    //game.init();
    /*let requestAnimId;

    let initialization = function () {
        game.init();
        requestAnimId = window.requestAnimationFrame(main);
    };

    let main = function() {
        game.clearLayer(game.playersBallLayer);
        game.displayPlayers();
        game.movePlayers();
        game.moveBall();
        if(game.ball.inGame) {
            game.lostBall();
        }
        ai.move();
        game.collideBallWithPlayersAndAction();
        requestAnimId = window.requestAnimationFrame(main);
    };

    initialization();*/

    res.status(200);
});
/*
let io = socket(server);

io.sockets.on('connection', (sock) => {
    connections.push(sock);
    sock.on('start', (data) => {
        console.log("Un utilisateur est connecté: " + data.id + ", nombre de connexions: " +connections.length);
    })
});*/

