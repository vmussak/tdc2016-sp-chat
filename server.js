const app = require('express')(),
    express = require('express'),
    server = require('http').Server(app),
    io = require('socket.io')(server);

app.use(express.static('.'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.use((req, res) => {
    res.sendFile(__dirname + "/not-found.html");
});

io.on('connection', (socket) => {
    socket.on('login', (usuario) => {
        socket.usuario = usuario;
        socket.broadcast.emit('mensagem', {
            usuario: 'Servidor',
            mensagem: usuario + " entrou na conversa..."
        });
        socket.emit('mensagem', {
            usuario: 'Servidor',
            mensagem: 'Olá, ' + usuario + ' seja bem-vindo ao chat!'
        });
    });

    socket.on('mensagem', (msg) => {
        socket.broadcast.emit('mensagem', {
            usuario: socket.usuario,
            mensagem: msg
        });
    });

    socket.on('disconnect', () => {
        if(socket.usuario)
            socket.broadcast.emit('mensagem', {
                usuario: 'Servidor',
                mensagem: socket.usuario + " saiu da conversa..."
            });
    });
});

app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), () => {
    console.log('Server Up!');
});

