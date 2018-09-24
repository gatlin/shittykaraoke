declare var io: any; // type kludge for socket.io

export class WS {
    private socket: any; // type kludge
    private listeners: Array<any>;
    constructor() {
        this.socket = io();
        this.listeners = [];
        this.socket.on('msg', msg => {
            this.listeners.forEach(listener => {
                listener(msg);
            });
        });
    }

    public send(msg: any): this {
        this.socket.emit('msg', msg);
        return this;
    }

    public subscribe(listener) {
        this.listeners.push(listener);
        return this;
    }
}
