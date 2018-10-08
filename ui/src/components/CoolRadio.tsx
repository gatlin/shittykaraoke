import * as Alm from '../../../alm';
import './CoolRadio.css';
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

export { CoolRadio };
