import express from 'express'
import connect_mongodb from './model/connect_mongodb.js'
import MessageContent from './model/messages.js'
import mongoose from 'mongoose'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'http'
import messages from './model/messages.js'


const app = express()

const httpServer = createServer(app);

const port = process.env.PORT || 3000

// connect_mongodb()

const users = {}

const rooms = new Map();

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});

// io.on("connection", (socket) => {
//     socket.on('new-user-online', name => {
//         console.log('new-user.....', name)
//         users[socket.id] = name;
//         socket.broadcast.emit('user-online', name)
//     })

//     socket.on('send', message => {
//         const timestamp = new Date().toUTCString()
//         socket.broadcast.emit('receive', { message: message, name: users[socket.id], time: timestamp })
//     })

//     socket.on('disconnect', message => {
//         socket.broadcast.emit('left', users[socket.id])
//         delete users[socket.id]
//     })
// });

io.on("connection", (socket) => {
    socket.on('new-user-online', name => {
        console.log('new-user.....', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-online', name);
    });

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        rooms.set(socket.id, roomId);
        socket.emit('roomJoined', roomId);
        socket.to(roomId).emit('userJoinedRoom', { roomId, userId: socket.id });
    });

    socket.on('send', message => {
        const roomId = rooms.get(socket.id);
        const timestamp = new Date().toUTCString();
        socket.to(roomId).emit('receive', { message, name: users[socket.id], time: timestamp });
    });

    socket.on('disconnect', () => {
        const roomId = rooms.get(socket.id);
        if (roomId) {
            socket.to(roomId).emit('userLeftRoom', {name: users[socket.id], roomId, userId: socket.id });
            socket.leave(roomId);
            rooms.delete(socket.id);
        }
        delete users[socket.id];
    });
});












app.get('/', (req, res) => {
    res.status(200).send('hello')
})



app.get('/api/v1/messages/sync', async (req, res) => {

    try {

        await MessageContent.find()
            .then((data) => {

                console.log('successfully message get!')

                res.status(200).send(data)
            })
            .catch((error) => {
                console.log('error getting messages!', error)
                res.status(500).send(error)
            })

    }
    catch (error) {
        console.log('error performing messages operation on server:', error)
    }


})



app.post('/api/v1/messages/new', async (req, res) => {
    const messagesGet = req.body

    console.log('messagesGet..............', messagesGet)



    try {

        await MessageContent.create(messagesGet)
            .then(() => {

                console.log('successfully message created!')

                res.status(200).send('successfully saved messages!')
            })
            .catch((error) => {

                console.log('error creating messages!', error)
                res.status(500).send(error)
            })



    }
    catch (error) {
        console.log('error performing messages operation on server:', error)
    }


})


httpServer.listen(port, () => {
    console.log(`server is listening on port ${port} ...`)
})