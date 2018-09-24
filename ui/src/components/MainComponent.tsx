import * as Alm from 'alm';

import './MainComponent.css';
import * as hellyeaPng from './hellyea.png';
import * as actions from '../actions';
// build out the track listings from search results
const trackListings = tracks => tracks.map(
    (track, idx) => (
        <li
            className='track-listing'
            id={'track-listing-' + idx}>
            {track.render()}
        </li>
    )
);

const CoolRadio = props => (
    <div className='cool-radio'>
      <input
        type='radio'
        name='search-by-radio'
        id={props.id}
        className={props.checked ? 'yay' : 'nay'}
        checked={props.checked ? 'checked' : null}
        on={{ change: () => props.action() }}
        />
        <label for={props.id}>{ props.label }</label>
    </div>
);

/**
 * The main application component. Self-explanatory.
 */
const MainComponent = Alm.connect(
    state => ({ ...state }),
    dispatch => ({
        updateSongQuery: q => dispatch(actions.updateSongQuery(q)),
        setSearchBy: s => dispatch(actions.searchBy(s)),
        search: () => dispatch(actions.search())
    })
)(props => (
    <div
        id="the_app"
        className="app">
        <header
          id="header"
          className="header">
          <img id='hellyea' src={hellyeaPng}/>
        </header>
        <input
          type='text'
          name='song-search'
          id='song-search-input'
          placeholder={'Which ' + props.searchBy + '?'}
          on={{
              input: evt => {
                  props.updateSongQuery(evt.getValue());
              },
              keydown: evt => {
                  if (evt.getRaw().keyCode === 13) {
                      props.search();
                  }
              }
          }}
          >
        </input>
        <div id='mode-selection'>
          <CoolRadio
            id='search-by-title'
            label='Search by Title'
            checked={props.searchBy === 'title'}
            action={ () => props.setSearchBy('title') }
            ></CoolRadio>
          <CoolRadio
            id='search-by-artist'
            label='Search By Artist'
            checked={props.searchBy === 'artist'}
            action={ () => props.setSearchBy('artist') }
            ></CoolRadio>
        </div>
        <div id='track-listings-wrapper'>
          <ul id='track-listings'>
            {trackListings(props.listed_tracks)}
          </ul>
        </div>
    </div>

));

export default MainComponent;
