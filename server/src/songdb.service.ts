import { Injectable } from '@nestjs/common';
import { Track, TrackSource } from '../../common/track';
import * as byline from 'byline';
import * as fuzzy from 'fuzzy';
import * as fs from 'fs';
import * as Promise from 'bluebird';
import * as Spreadsheet from 'google-spreadsheet';
import { ConfigService } from './config.service';

const fuzzy_options_titles = {
    extract: item => item.title
};

const fuzzy_options_artists = {
    extract: item => item.artist
};

export type StyleSet = {
    [s: string]: boolean;
};

function* songsForStyleGenerator(style, songs) {
    // Step 1: filter only those songs with the specified style.
    const songsInStyle = songs.filter(song => song.styles.indexOf(style) > -1);
    console.log('generating songs', style + ' : ' + songsInStyle.length);

    // Step 2: sort them by artist.
    songsInStyle.sort((song1, song2) => song1.artist < song2.artist);

    // Step 3: yield at most 100 at a time.
    let counter = 0;
    while (counter < songsInStyle.length) {
        yield songsInStyle.slice(counter, counter + 100);
        counter += 100;
    }
    yield null;
}

@Injectable()
export class SongDBService {
    public songs: Array<Track> = [];
    private styles: StyleSet = {};

    private songStyleGenerators = {};

    constructor(private readonly cfg: ConfigService) {
        this.importSongs(cfg.songfiles.karafun, TrackSource.Karafun);
        this.importSongs(cfg.songfiles.community, TrackSource.Community);
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

        const styles: StyleSet = {};

        file_stream.on('data', line => {
            let track = source === TrackSource.Karafun
                ? Track.parse_karafun(line.toString())
                : Track.parse_community(line.toString());
            for (let idx in track.styles) {
                let style = track.styles[idx].trim().replace(/^"/, '').
                    replace(/"$/, '');
                styles[style] = true;
            }
            this.songs.push(track);
        });

        this.styles = styles;
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
                        [],
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

    public allStyles(): Array<String> {
        return Object.keys(this.styles).sort().filter(style => style !== 'Styles');
    }

    public songsForStyle(style, clientId, resume) {
        if (!resume ||
            (resume && !this.songStyleGenerators[clientId])) {
            // create a new one
            this.songStyleGenerators[clientId] =
                songsForStyleGenerator(style, this.songs);

            // evict it after 2 minutes though
            setTimeout(() => {
                delete this.songStyleGenerators[clientId];
            }, 120000);
        }
        const songs = this.songStyleGenerators[clientId].next().value;
        return songs.map(s => s.serialize());
    }
}
