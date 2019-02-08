const io = require("socket.io")();
io.on("connection", (client) => {
    
});

const port = 8888;
io.listen(port);
console.log("server set up!!!!!");