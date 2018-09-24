import * as socketIO from 'socket.io';
import * as http from 'http'; // maybe don't need this

export type Request = {
    msg: any;
    reply: (m: any) => void;
    broadcast: (m: any) => void;
};

export type Response = (req: Request) => void;

export class WSServer {
    private router = {};
    private io: any; // kludge

    constructor(httpServer) {
        this.io = socketIO(httpServer);
        this.io.on('connection', socket => {
            socket.on('msg', msg => {
                this.router[msg.type]({
                    msg,
                    reply: data => {
                        socket.emit('msg', data);
                    },
                    broadcast: data => {
                        this.io.emit('msg', data);
                    }
                }
                );
            });

        });
    }

    public route(rt, cb: Response) {
        this.router[rt] = cb;
        return this;
    }
}
