import * as Alm from '../../../alm';

import './MainComponent.css';
import * as hellyeaPng from './hellyea.png';

import { SearchForm } from './SearchForm';
import { BrowseForm } from './BrowseForm';
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
    dispatch => ({})
)(props => (
    <div
      id="the_app"
      className="app">
      <header
        id="header"
        className="header">
        <img id='hellyea' src={hellyeaPng}/>
      </header>
      { whichForm(props.mode) }
    </div>
));

export default MainComponent;
