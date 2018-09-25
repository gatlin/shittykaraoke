import { Alm } from 'alm';

import { Actions, searchResults } from './actions';
import MainComponent from './components/MainComponent';
import { reducer, State, initialState } from './reducer';
import { WS } from './ws';


// The actual application.
const app = new Alm({
    model: initialState,
    update: reducer,
    view: MainComponent(),
    domRoot: 'main',
    eventRoot: 'main'
});

initialState.ws.subscribe(msg => {
    app.store.dispatch(searchResults(msg.data));
});

// And we're off
app.start();
