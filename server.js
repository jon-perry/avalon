const io = require('socket.io')();

io.on('connection', (client) => {
    console.log('tset');
});

const port = 8888;
io.listen(port);
console.log('server set up!!!!!');