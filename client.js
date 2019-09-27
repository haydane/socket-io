const socket = io("http://localhost:3000");
const sendButton = document.getElementById("send-button");
const msgInput = document.getElementById("msg-input");
const msgContainer = document.getElementById('msg-container');


appendMsg = (msg) => {
    const msgEle = document.createElement('div');
    msgEle.innerText = msg;
    msgEle.setAttribute('style','margin-top: 2px; background-color: #ff7675;border-width: 1; border-radius: 30px; color: white;padding: 10px;');
    msgContainer.prepend(msgEle);
    return msgContainer;
}

const name = prompt("what is ypur name?");
appendMsg('you joined');


socket.emit('new-user',name);
socket.on('user-connected', name => {
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



