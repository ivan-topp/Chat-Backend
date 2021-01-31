class Sockets {
    constructor( io ){
        this.io = io;
        this.socketEvents();
    }

    socketEvents(){
        this.io.on('connection', ( client ) => {
            console.log('Cliente conectado');
            client.on('mensaje-to-server', ( payload ) => {
                console.log(payload);
        
                this.io.emit('mensaje-from-server', payload );
            });
            client.on('disconnect', () => { 
                console.log('Cliente desconectado');
            });
        });
    }

}

module.exports = Sockets;