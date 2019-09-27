const io = require('socket.io')(3000);
const express = require('express');
const path = require('path');
const app = express();

const users = {};
io.on('connection', socket => {
    
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected',name => {
            console.log(`${name} connected`);
        });
    });
    socket.on('send-chat-msg', msg => {
        socket.broadcast.emit('chat-message', {
            msg : msg, name: users[socket.id]
        });
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