const io = require('socket.io')(3000);
const SHA256 = require('crypto-js/sha256');
const express = require('express');
const app = express();
const path = require('path');
const uuidV1 = require('uuid/v1');

calculateHash = () => {
    let current_date = (new Date()).valueOf().toString();
    let random = Math.random().toString();
    return SHA256(current_date + random).toString();
}
const users = {};
io.on('connection', socket => {
    
    socket.on('new-user', () => {
        users[socket.id] = uuidV1();
        socket.broadcast.emit('user-connected',users[socket.id]);
        console.log(`${users[socket.id]} connected`);
    });
    socket.on('send-chat-msg', msg => {
        socket.broadcast.emit('chat-message', {
            msg : msg, name: users[socket.id]
        });
        console.log(`${users[socket.id]}: ${msg}`);
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected',users[socket.id]);
        console.log(`${users[socket.id]} disconnected`);
        delete users[socket.id];
    })
    socket.on('user-typing', name => {
        socket.broadcast.emit('typing', name);
        // console.log(`${name} is typing`);
    })
});

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css/')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js/')));
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname ,'./index.html'));
})

app.listen(3000, () => console.log("app is listening on port 3000"));