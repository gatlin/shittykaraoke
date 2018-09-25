import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from '@nestjs/websockets';
//import { from, Observable } from 'rxjs';
//import { map } from 'rxjs/operators';
import { SongDBService } from '../songdb';

export type SearchResult = {
    'type': string;
    'data': Array<any>;
};

@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer() server;

    constructor(private readonly sdb: SongDBService) { }

    @SubscribeMessage('msg')
    findAll(client, data): WsResponse<any> {
        console.log('data', data);
        let results = [];
        switch (data['type']) {
            case 'title':
                results = this.sdb.searchTitle(data.data)
                    .map(track => track.serialize());
                break;
            case 'artist':
                results = this.sdb.searchArtist(data.data)
                    .map(track => track.serialize());
                break;
            default:
                results = [];
        }
        console.log('results', results);
        return {
            event: 'msg',
            data: {
                type: 'results',
                data: results
            }
        };
    }

    @SubscribeMessage('identity')
    async identity(client, data: number): Promise<number> {
        return data;
    }
}
