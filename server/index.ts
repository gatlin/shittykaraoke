import { Track, TrackSource } from '../common/track';
import * as config from './config';
import { WSServer, Request, Response } from './ws';
import { Msg } from '../common/msg';
import { SongDB } from './songdb';

import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as socketIO from 'socket.io';

const express_app = express();
const server = http.createServer(express_app);

/*** UI file serving */

// in debug mode we want to make sure we aren't viewing the minified assets
if (config.debug) {
    express_app.use('/dist', (req, res, next) => {
        res.statusCode = 302;
        res.setHeader('Location', '/static/' + req.url);
        next();
    });
}

express_app.use(
    express.static(
        path.join(
            __dirname + '/../../../ui/')));

/*** Initialize the song db */
let sdb = new SongDB()
    .importSongs(config.songfiles.community, TrackSource.Community)
    .importSongs(config.songfiles.karafun, TrackSource.Karafun);

/*** HTTP server setup */
server.listen(config.http_port, () => {
    console.log('Listening on port ' + config.http_port);

});

/*** websocket server setup */
const wss = new WSServer(server)
    .route('title', request => {
        let results;
        if (request.msg.data === '') {
            results = [];
        } else {
            results = sdb.searchTitle(request.msg.data)
                .map(track => track.serialize());
        }
        request.reply({
            type: 'results',
            data: results
        });
    })
    .route('artist', request => {
        let results;
        if (request.msg.data === '') {
            results = [];
        } else {
            results = sdb.searchArtist(request.msg.data)
                .map(track => track.serialize());
        }
        request.reply({
            type: 'results',
            data: results
        });
    })
    ;
