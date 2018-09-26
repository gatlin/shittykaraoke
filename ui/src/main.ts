import { Alm } from '../../alm';
import { Actions, searchResults, browseResults, browseStyles } from './actions';
import MainComponent from './components/MainComponent';
import { reducer, State, initialState } from './reducer';
import { WS } from './ws';
import './reset.css';
import './main.css';

// The actual application.
const app = new Alm({
    model: initialState,
    update: reducer,
    view: MainComponent(),
    domRoot: 'main',
    eventRoot: 'main'
});

document.title = "he'll yea1";

initialState.ws.subscribe('msg', msg => {
    app.store.dispatch(searchResults(msg.data));
});

initialState.ws.subscribe('browse', msg => {
    app.store.dispatch(browseResults(msg));
});

// And we're off
app.start();

initialState.ws.send('browse', { type: 'browse-styles' });
initialState.ws.send('browse', {
    type: 'songs-for-style',
    data: {
        style: '80s',
        resume: false
    }
});
window.setTimeout(() => {
    initialState.ws.send('browse', {
        type: 'songs-for-style',
        data: {
            style: '80s',
            resume: true
        }
    });
}, 5000);
