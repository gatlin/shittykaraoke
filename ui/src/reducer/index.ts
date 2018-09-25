/**
 * @module reducer
 * Each reducer module defines / should define its own State type, initial
 * state, and reducer function. This is the place to combine them all into one.
 */

import { makeReducer } from 'alm';
import { Actions } from '../actions';
import { WS } from '../ws';
import { Track } from '../../../common/track';

export enum Mode {
    Search,
    Browse
};

export type State = {
    mode: Mode;
    searchBy: 'title' | 'artist';
    songQuery: string;
    ws: WS;
    listed_tracks: Array<Track>;
};

export const initialState: State = {
    mode: Mode.Search,
    searchBy: 'title',
    songQuery: '',
    ws: new WS(),
    listed_tracks: []
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
                mode: Mode.Browse
            };

        case Actions.SetModeSearch:
            return {
                ...state,
                mode: Mode.Search
            };

        case Actions.SearchBy:
            return {
                ...state,
                searchBy: action.data
            };

        case Actions.SearchResults: {
            if (typeof action === 'undefined') {
                return state;
            }
            return {
                ...state,
                listed_tracks: action.data.map(
                    str => Track.deserialize(str))
            };
        }

        default:
            return state;
    }
};
