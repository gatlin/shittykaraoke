import { Injectable } from '@nestjs/common';
import { Track, TrackSource } from '../../common/track';
import * as byline from 'byline';
import * as fuzzy from 'fuzzy';
import * as util from 'util';
import * as fs from 'fs';
import * as jsonfile from 'jsonfile';
import * as Promise from 'bluebird';
import * as Spreadsheet from 'google-spreadsheet';

const fuzzy_options_titles = {
    extract: item => item.title
};

const fuzzy_options_artists = {
    extract: item => item.artist
};

const config = jsonfile.readFileSync('./config.json');

@Injectable()
export class SongDBService {
    public songs: Array<Track> = [];

    constructor() {
        this.importSongs(config.songfiles.karafun, TrackSource.Karafun);
        this.importSongs(config.songfiles.community, TrackSource.Community);
    }

    public importSongs(songs, source) {
        if (songs.source === 'local') {
            this.importSongFile(songs.uri, source);
        }

        if (songs.source === 'google-drive') {
            this.importSongFromDrive(songs.uri, source);
        }
    }

    private importSongFile(file, source) {
        let file_stream = byline(fs.createReadStream(file, {
            encoding: 'utf-8'
        }));

        file_stream.on('data', line => {
            let track = source === TrackSource.Karafun
                ? Track.parse_karafun(line.toString())
                : Track.parse_community(line.toString());

            this.songs.push(track);
        });
    }

    private importSongFromDrive(key, source) {
        let file = new Spreadsheet(key);
        Promise.promisify(file.getInfo)()
            .then(info => {
                return Promise.promisify(info.worksheets[0].getRows)();
            })
            .then(rows => {
                rows.map(row => {
                    this.songs.push(new Track(
                        0,
                        row.title,
                        row.artist,
                        row.year || 'n/a',
                        row.duo || false,
                        row.explicit || false,
                        source
                    ));
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    private search(needle, options) {
        if (needle !== '') {
            let results = fuzzy.filter(needle, this.songs, options);
            return results.map(result => result.original);
        }
        return [];
    }

    public searchTitle(needle) {
        return this.search(needle, fuzzy_options_titles);
    }

    public searchArtist(needle) {
        return this.search(needle, fuzzy_options_artists);
    }
}
