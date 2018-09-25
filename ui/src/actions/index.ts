/**
 * @module actions
 * Two sorts of things are exported from here: the {@link Actions} enum and the
 * actual action creators.
 */

declare var io: any; // type kludge for socket.io

export enum Actions {
    SetModeSearch,
    SetModeBrowse,
    UpdateSongQuery,
    SetServerMessage,
    SearchBy,
    SearchResults,
    Search
};

export const setModeSearch = ({
    'type': Actions.SetModeSearch
});

export const setModeBrowse = ({
    'type': Actions.SetModeBrowse
});

export const updateSongQuery = queryStr => ({
    'type': Actions.UpdateSongQuery,
    data: queryStr
});

export const searchBy = searchBy => ({
    'type': Actions.SearchBy,
    data: searchBy
});

export const searchResults = data => ({
    type: Actions.SearchResults,
    data
});

export const search = () => (dispatch, getState) => {
    const { ws, searchBy, songQuery } = getState();
    if (songQuery.trim() === '') {
        dispatch({
            type: Actions.SetServerMessage,
            data: 'aoeuaoeu'
        });
    }
    else {
        ws.send({
            type: searchBy,
            data: songQuery
        });
    }
};
