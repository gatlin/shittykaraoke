declare var io: any; // type kludge for socket.io

const channels = [
    'msg',
    'browse'
];

export class WS {
    private socket: any; // type kludge
    private listeners: Array<any>;
    private channels: Object = {};
    constructor() {
        this.socket = io();
        channels.forEach(channel => {
            if (!this.channels[channel]) {
                this.channels[channel] = [];
            }
        });
        channels.forEach(channel => {
            const listeners = this.channels[channel];
            this.socket.on(channel, msg => {
                listeners.forEach(listener => {
                    listener(msg);
                });
            });
        });
    }

    public send(channel, msg: any): this {
        this.socket.emit(channel, msg);
        return this;
    }

    public subscribe(channel, listener) {
        this.channels[channel].push(listener);
        return this;
    }
}
