import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from '@nestjs/websockets';
//import { from, Observable } from 'rxjs';
//import { map } from 'rxjs/operators';
import { SongDBService } from './songdb.service';

export type SearchResult = {
    'type': string;
    'data': Array<any>;
};

@WebSocketGateway()
export class WsGateway {
    @WebSocketServer() server;

    constructor(private readonly sdb: SongDBService) { }

    @SubscribeMessage('msg')
    findAll(client, data): WsResponse<any> {
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
        results = results.slice(0, 100);
        return {
            event: 'msg',
            data: {
                type: 'results',
                data: {
                    results,
                    message: results.length
                        ? `Found ${results.length} result${results.length > 1 ? 's' : ''}.`
                        : 'Sorry, we couldn\'t find anything.'
                }
            }
        };
    }

    @SubscribeMessage('identity')
    async identity(client, data: number): Promise<number> {
        return data;
    }
}
