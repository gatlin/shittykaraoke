import * as Alm from '../../../alm';

import './MainComponent.css';
import * as hellyeaPng from './hellyea.png';

import { SearchForm } from './SearchForm';
import { BrowseForm } from './BrowseForm';
import { CoolRadio } from './CoolRadio';
import * as actions from '../actions';
// build out the track listings from search results

/**
 * The main application component. Self-explanatory.
 */

const whichForm = mode => {
    if (mode === 'search') {
        return (<SearchForm/>);
    }
    if (mode === 'browse') {
        return (<BrowseForm/>);
    }
    return null;
};

const MainComponent = Alm.connect(
    state => state,
    dispatch => ({
        setModeSearch: () => dispatch(actions.setModeSearch()),
        setModeBrowse: () => dispatch(actions.setModeBrowse())
    })
)(props => (
    <div
      id="the_app"
      className="app">
      <header
        id="header"
        className="header">
        <img id='hellyea' src={hellyeaPng}/>
        <div id='search-browse-control'>
          <CoolRadio
            id='do-search-ui'
            checked={props.mode === 'search'}
            action={() => props.setModeSearch()}
            >
            Search
          </CoolRadio>
          <CoolRadio
            id='do-browse-ui'
            checked={props.mode === 'browse'}
            action={() => props.setModeBrowse()}
            >
            Browse
          </CoolRadio>
        </div>
      </header>
      { whichForm(props.mode) }
    </div>
));

export default MainComponent;
