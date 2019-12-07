import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the atendee state domain
 */

const selectAtendeeDomain = state => state.atendee || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Atendee
 */

const makeSelectAtendee = () =>
  createSelector(
    selectAtendeeDomain,
    substate => substate,
  );

export default makeSelectAtendee;
export { selectAtendeeDomain };
