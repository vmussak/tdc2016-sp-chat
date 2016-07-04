const app = require('express')(),
    express = require('express'),
    server = require('http').Server(app),
    io = require('socket.io')(server);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.use(express.static('.'));

io.on('connection', (socket) => {
    console.log('Alguém se conectou!');

    socket.emit('mensagem', {
        usuario: 'Servidor',
        mensagem: 'Olá, seja bem-vindo ao chat!'
    });

    socket.on('login', (usuario) => {
        socket.usuario = usuario;
        socket.broadcast.emit('mensagem', {
            usuario: 'Servidor',
            mensagem: usuario + " entrou na conversa..."
        });
    });

    socket.on('mensagem', (msg) => {
        socket.broadcast.emit('mensagem', {
            usuario: socket.usuario,
            mensagem: msg
        });
    });

    socket.on('disconnect', () => {
        console.log('Alguém saiu :(');
    });
});

server.listen(3000, () => {
    console.log('Server Up!');
});