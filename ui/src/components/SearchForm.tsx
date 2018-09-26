import * as Alm from '../../../alm';
import './SearchForm.css';
import * as actions from '../actions';

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
        <label forId={props.id}>{ props.children }</label>
    </div>
);

const trackListings = tracks => tracks.map(
    (track, idx) => (
        <li

          ref={ element => {
          }}
            className='track-listing'
            id={'track-listing-' + idx}>
            {track.render()}
        </li>
    )
);

export const SearchForm = Alm.connect(
    state => state,
    dispatch => ({
        updateSongQuery: q => dispatch(actions.updateSongQuery(q)),
        setSearchBy: s => dispatch(actions.searchBy(s)),
        search: () => dispatch(actions.search())
    })
)(props => (
    <div id='search-component'>
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
                    document.getElementById('song-search-input').blur();
                    props.search();
                }
            }
        }}
        >
      </input>
      <div id='mode-selection'>
        <CoolRadio
          id='search-by-title'
          checked={props.mode === 'search' && props.searchBy === 'title'}
          action={ () => props.setSearchBy('title') }
          >
          Search by title
        </CoolRadio>
        <CoolRadio
          id='search-by-artist'
          checked={props.mode === 'search' && props.searchBy === 'artist'}
          action={ () => props.setSearchBy('artist') }
          >
          Search by artist
        </CoolRadio>
      </div>

      <h2 id='server-message'>{props.serverMessage}</h2>
      <div id='track-listings-wrapper'>
        <ul id='track-listings'>
          {trackListings(props.listed_tracks)}
        </ul>
      </div>
    </div>
));
