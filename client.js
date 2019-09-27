const socket = io("http://localhost:3000");
const sendButton = document.getElementById("send-button");
const msgInput = document.getElementById("msg-input");
const msgContainer = document.getElementById('msg-container');
const SHA256 = require('crypto-js/sha256');


appendMsg = (msg) => {
    const msgEle = document.createElement('div');
    msgEle.innerText = msg;
    msgEle.setAttribute('style','margin-top: 2px; background-color: #ff7675;border-width: 1; border-radius: 30px; color: white;padding: 10px;');
    msgContainer.prepend(msgEle);
    return msgContainer;
}

var current_date = (new Date()).valueOf().toString();
var random = Math.random().toString();
calculateHash = () => {
    return SHA256(current_date + random).toString();
}

appendMsg('you joined');
let name = calculateHash();
socket.emit('new-user',name);
socket.on('user-connected', name => {
    console.log(name)
    appendMsg(`${name} connected`);
}) 

sendButton.addEventListener('click', e => {
    e.preventDefault();
    const msg = msgInput.value;
    appendMsg(`You: ${msg}`);
    socket.emit('send-chat-msg', msg);
    msgInput.value = '';
})

socket.on('chat-message', data => {
    appendMsg(`${data.name}: ${data.msg}`);
});

socket.on('user-disconnected', name => {
    appendMsg(`${name} disconnected`);
})

msgInput.addEventListener('keypress', () => {
    socket.emit('user-typing',name);
});

// socket.on('typing', name => {
//     appendMsg(`${name} is typing`)
// })

