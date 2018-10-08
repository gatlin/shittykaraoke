/**
 * @module reducer
 * Each reducer module defines / should define its own State type, initial
 * state, and reducer function. This is the place to combine them all into one.
 */

import { makeReducer } from '../../../alm';
import { Actions } from '../actions';
import { WS } from '../ws';
import { Track } from '../../../common/track';

export type State = {
    mode: 'search' | 'browse';
    searchBy: 'title' | 'artist';
    songQuery: string;
    ws: WS;
    listed_tracks: Array<Track>;
    serverMessage: string;
    styles: Array<String>;
    songsForStyle: { [key: string]: Array<Track> };
    currentStyle: string;
};

export const initialState: State = {
    mode: 'search',
    searchBy: 'title',
    songQuery: '',
    ws: new WS(),
    listed_tracks: [],
    serverMessage: '',
    styles: [],
    songsForStyle: {},
    currentStyle: ''
};

export const reducer = (state = initialState, action) => {
    if (typeof action === 'undefined') {
        return state;
    }
    switch (action.type) {

        case Actions.UpdateSongQuery:
            return { ...state, songQuery: action.data };

        case Actions.SetModeBrowse:
            return {
                ...state,
                mode: 'browse'
            };

        case Actions.SetModeSearch:
            return {
                ...state,
                mode: 'search'
            };

        case Actions.SearchBy:
            return {
                ...state,
                searchBy: action.data
            };

        case Actions.SearchResults: {
            return {
                ...state,
                listed_tracks: action.data.results.map(
                    str => Track.deserialize(str)),
                serverMessage: action.data.message
            };
        }

        case Actions.SetServerMessage: {
            return {
                ...state,
                serverMessage: action.data
            };
        }

        case Actions.UpdateStyles:
            return {
                ...state,
                styles: action.data
            };

        case Actions.UpdateSongsForStyle: {
            const { songs, style } = action.data;

            const tracks = songs.map(song => Track.deserialize(song));
            let sfs = { ...state.songsForStyle };
            if (!(style in state.songsForStyle)) {
                sfs[style] = tracks;
            }
            else {
                sfs[style] = [...sfs[style], ...tracks];
            }

            return {
                ...state,
                songsForStyle: { ...sfs }
            };
        }

        case Actions.SetCurrentStyle:
            return { ...state, currentStyle: action.data };

        default:
            return state;
    }
};
