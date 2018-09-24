import * as fs from 'fs';
import { Track, TrackSource } from '../common/track';
import * as byline from 'byline';
import * as fuzzy from 'fuzzy';
import * as Promise from 'bluebird';

declare var require: any;

let Spreadsheet = require('google-spreadsheet');

const fuzzy_options_titles = {
    extract: item => item.title
};

const fuzzy_options_artists = {
    extract: item => item.artist
};

type Tracks = Array<Track>;

export class SongDB {
    public songs: Array<Track> = [];
    constructor(songs = []) {
        this.songs = songs;
    }

    public importSongs(songs, source) {
        if (songs.source === 'local') {
            return this.importSongFile(songs.uri, source);
        }

        if (songs.source === 'google-drive') {
            return this.importSongFromDrive(songs.uri, source);
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
        return this;
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
                console.log('rows', rows);
            })
            .catch(err => {
                console.error(err);
            });
        return this;
    }

    private search(needle, options) {
        let results = fuzzy.filter(needle, this.songs, options);
        return results.map(result => result.original);
    }

    public searchTitle(needle) {
        return this.search(needle, fuzzy_options_titles);
    }

    public searchArtist(needle) {
        return this.search(needle, fuzzy_options_artists);
    }
}
