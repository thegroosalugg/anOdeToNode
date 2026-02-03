import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import AppError from './models/Error';
import captainsLog from './util/captainsLog';

let io: Server;

const socket = {
  init: (server: HttpServer) => {
    io = new Server(server, {
      cors: {
                origin: process.env.CLIENT_URL,
               methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }, // set up websockets. CORS applies only to sockets, not regular HTTP
    });

    io.on('connection', (socket) => {
      captainsLog(200, { socket: 'CONNECTED' }); // status codes here refer to Fn colors
      socket.on('disconnect', () => captainsLog(500, { socket: 'DISCONNECTED' }))
    });

    return io;
  },

  getIO: () => {
    if (!io) throw new AppError(500, 'Connection not established', 'No socket initialised');
    return io;
  },
};

export default socket;
