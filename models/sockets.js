const { verifyJWT } = require('../helpers/jwt');
const { userConnected, userDisconnected, getUsers, saveMessage } = require('../controllers/sockets');

class Sockets {
    constructor( io ){
        this.io = io;
        this.socketEvents();
    }

    socketEvents(){
        this.io.on('connection', async ( client ) => {
            const [ isValid, uid ] = verifyJWT(client.handshake.query['x-token']);
            if(!isValid){
                console.log('Socket no identificado');
                return client.disconnect();
            }
            const user = await userConnected( uid );
            console.log('Cliente conectado:', user.name);
            client.join( uid );
            // TODO: Validar JWT
            // TODO: Identificar usuario activo
            // TODO: Emitir todos los usuarios conectados
            this.io.emit('users-list', await getUsers());
            // TODO: Socket join, uid
            // TODO: Escuchar cuando el cliente manda un mensaje
            client.on('personal-message', async payload => {
                const message = await saveMessage(payload);
                this.io.to(payload.to).emit('personal-message', message);
                this.io.to(payload.from).emit('personal-message', message);
            });
            // TODO: Disconnect (Marcar en la db cuando un usuario se desconecta)
            client.on('disconnect', async () => {
                console.log('Cliente desconectado:', user.name);
                await userDisconnected( uid );
                this.io.emit('users-list', await getUsers());
            });
        });
    }

}

module.exports = Sockets;