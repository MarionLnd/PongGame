const app = require('./js/express')();
const socket = require('socket.io');
const io = require('./js/ioconf');
const path = require('path');

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname + '\\pong.html'));
    res.status(200);
});

let server = app.listen(2222);
io(server);

console.log("Running on port 2222");


