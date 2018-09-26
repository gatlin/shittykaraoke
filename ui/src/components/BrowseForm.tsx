import * as Alm from '../../../alm';
import * as actions from '../actions';
import './BrowseForm.css';

const styleItems = (styles, currentStyle, cb) => styles.map(
    (style, idx) => (
        <div
          className={'style-listing' + (currentStyle === style ? ' current-style':'')}
          id={'style-listing-'+idx}
          on={{
              click: () => cb(style)
          }}
          >
          {style}
        </div>
    )
);

const songItems = songs => songs.map(
    (song, idx) => (
        <div className='song-listing' id={'song-listing-'+idx}>
          { song.render() }
        </div>
    )
);

export const BrowseForm = Alm.connect(
    state => state,
    dispatch => ({
        browseSongsForStyle: s => dispatch(actions.browseSongsForStyle(s))
    })
)(props => (
    <div id='browse-component'>
      <div id='styles-list'>
        {styleItems(props.styles,
                    props.currentStyle,
                    s => props.browseSongsForStyle(s)
        )}
      </div>

      <div
        id='songs-list'>
        { props.currentStyle === '' ? null : (
            songItems(props.songsForStyle[props.currentStyle] || [])
        )}
      </div>
    </div>
));
