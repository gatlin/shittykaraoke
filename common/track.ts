import { el } from '../alm';

function remove_quotes(str: string): string {
    return str
        .replace(/^"/, '')
        .replace(/"$/, '');
}

export enum TrackSource {
    Karafun,
    Community
};

export class Track {

    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly artist: string,
        public readonly year: string,
        public readonly duo: boolean,
        public readonly explicit: boolean,
        public readonly source: TrackSource
    ) { }

    public render() {

        const title_el = el('span', {
            'class': 'track-title',
            'id': 'track-title-' + this.id.toString()
        }, [this.title]);

        const artist_el = el('span', {
            'class': 'track-artist',
            'id': 'track-artist-' + this.id.toString()
        }, [this.artist]);

        const classes = 'track' +
            (this.duo ? ' track-duo' : '') +
            (this.explicit ? ' track-explicit' : '');

        return el('div', {
            'class': classes,
            'id': 'track-' + this.id.toString(),
        }, [title_el, artist_el]);
    }

    static parse_karafun(csv_line: string) {
        let matches = csv_line.match(
            /(".*?"|[^";\s]+)(?=\s*;|\s*$)/g
        );

        if (!matches) { return null; }

        return new Track(
            parseInt(matches[0]),
            remove_quotes(matches[1]),
            remove_quotes(matches[2]),
            matches[3],
            matches[4] === "1",
            matches[5] === "1",
            TrackSource.Karafun
        );
    }

    static parse_community(csv_line: string) {
        let matches = csv_line.match(
            /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g
        );

        if (!matches) { return null; }

        return new Track(
            0,
            remove_quotes(matches[0]),
            remove_quotes(matches[1]),
            'N/A',
            false,
            false,
            TrackSource.Community
        );
    }

    public serialize() {
        return JSON.stringify({
            id: this.id.toString(),
            title: this.title,
            artist: this.artist,
            year: this.year,
            duo: this.duo,
            explicit: this.explicit,
            source: this.source === TrackSource.Karafun
                ? 'karafun'
                : 'community'
        });
    }

    static deserialize(_obj) {
        const obj = JSON.parse(_obj);
        return new Track(
            obj.id,
            obj.title,
            obj.artist,
            obj.year,
            obj.duo,
            obj.explicit,
            obj.source === 'karafun'
                ? TrackSource.Karafun
                : TrackSource.Community
        );
    }
}
