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
    Search,
    UpdateStyles,
    UpdateSongsForStyle,
    SetCurrentStyle,
    Nop
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

export const browseStyles = () => (dispatch, getState) => {
    const { ws } = getState();
    ws.send('browse', {
        type: 'browse-styles'
    });
};

export const browseSongsForStyle = style => (dispatch, getState) => {
    const { ws, songsForStyle } = getState();
    ws.send('browse', {
        type: 'songs-for-style',
        data: {
            style,
            resume: (songsForStyle[style] || []).length
        }
    });
    return {
        type: Actions.SetCurrentStyle,
        data: style
    };
};

export const browseResults = data => (dispatch, getState) => {
    if (data.type === 'styles') {
        return {
            type: Actions.UpdateStyles,
            data: data.data
        };
    }

    if (data.type === 'songs-for-style') {
        const { currentStyle } = getState();
        listenForScroll(() => {
            dispatch(browseSongsForStyle(currentStyle));
        });
        return {
            type: Actions.UpdateSongsForStyle,
            data: data.data
        };
    }
};

export const search = () => (dispatch, getState) => {
    const { ws, searchBy, songQuery } = getState();
    if (songQuery.trim() === '') {
        dispatch({
            type: Actions.SetServerMessage,
            data: 'aoeuaoeu'
        });
    }
    else {
        ws.send('msg', {
            type: searchBy,
            data: songQuery
        });
    }
};

export const listenForScroll = (cb) => {
    const scrollListener = function (e) {
        if ((window.innerHeight + Math.ceil(window.pageYOffset)) >=
            document.body.offsetHeight) {
            console.log('At the bottom!');
            window.removeEventListener('scroll', scrollListener);
        }
    };
    window.addEventListener('scroll', scrollListener);
    cb();
};
