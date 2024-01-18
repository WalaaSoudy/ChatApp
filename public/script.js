(function () {
    const app = document.querySelector('.app');
    const socket = io();
    let usname;

    app.querySelector('#join').addEventListener('click', function () {
        let username = app.querySelector('#name').value;
        if (username.length == 0) {
            alert('Please enter a username');
            return;
        }
        socket.emit('newuser', username);
        usname = username;
        app.querySelector('.join-screen').classList.remove('active');
        app.querySelector('.chat-screen').classList.add('active');
    });

    app.querySelector('.chat-screen #send').addEventListener('click', function () {
        let msg = app.querySelector('#message').value;
        if (msg.length == 0) {
            alert('Please enter a message');
            return;
        }
        renderMessage("my", {
            username: usname,
            text: msg
        });

        socket.emit('chat', {
            username: usname,
            text: msg
        });
        app.querySelector('#message').value = '';
    });

    app.querySelector('.chat-screen #leave').addEventListener('click', function () {
        app.querySelector('.join-screen').classList.add('active');
        app.querySelector('.chat-screen').classList.remove('active');
        socket.emit('exituser', usname);
    });

    socket.on('update', function (msg) {
        renderMessage("update", msg);
    });

    socket.on('chat', function (msg) {
        renderMessage("other", msg);
    });

    socket.on('newuser', function (username) {
        renderMessage("update", username + " joined the chat");
    });

    socket.on('exituser', function (username) {
        renderMessage("update", username + " left the chat");
    });

    function renderMessage(type, data) {
        let msgdiv = app.querySelector('.chat-screen .messages');
        if (type === "my") {
            let msg = document.createElement('div');
            msg.setAttribute("class", 'messages my-message');
            msg.innerHTML = `
                <div style="display: flex; justify-content: flex-end;">
                    <div style="max-width: 20%; background: #fff; box-shadow: #999; padding: 3px; margin-bottom: 5px;">
                        <div style="font-size: 14px; font-weight: 500; margin-bottom: 1px; color: #0e0707;">You</div>
                        <div style="word-wrap: break-word;">${data.text}</div>
                    </div>
                </div>`;
            msgdiv.appendChild(msg);
        } else if (type === "other") {
            let msg = document.createElement('div');
            msg.setAttribute("class", 'messages other-message');
            msg.innerHTML = `
                <div style="display: flex; justify-content: flex-start;">
                    <div style="max-width: 20%; background: #fff; box-shadow: #999; padding: 3px; margin-bottom: 5px;">
                        <div style="font-size: 14px; font-weight: 500; margin-bottom: 3px; color: #0e0707;">${data.username}</div>
                        <div style="word-wrap: break-word;">${data.text}</div>
                    </div>
                </div>`;
            msgdiv.appendChild(msg);
        } else if (type === "update") {
            let msg = document.createElement('div');
            msg.setAttribute("class", 'update');
            msg.innerHTML = data;
            msgdiv.appendChild(msg);
        }
        

    }
   
})();
