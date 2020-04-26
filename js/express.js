const express = require('express');

module.exports = function(){
    let app = express();

    app.use('/js', express.static('./js'));
    app.use('/css', express.static('./css'));
    app.use('/img', express.static('./img'));
    app.use('/sound', express.static('./sound'));
    app.use('/font', express.static('./font'));

    return app;
};