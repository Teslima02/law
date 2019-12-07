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

const makeSelectGetAllAttendees = () =>
  createSelector(
    selectAtendeeDomain,
    subState => subState.getAllAttendees,
  );

const makeSelectLoading = () =>
  createSelector(
    selectAtendeeDomain,
    subState => subState.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectAtendeeDomain,
    subState => subState.error,
  );

const makeSelectAttendeeDialog = () =>
  createSelector(
    selectAtendeeDomain,
    subState => subState.attendeeDialog,
  );

const makeSelectNewAttendee = () =>
  createSelector(
    selectAtendeeDomain,
    subState => subState.newAttendee,
  );

const makeSelectEditAttendee = () =>
  createSelector(
    selectAtendeeDomain,
    subState => subState.attendeeDialog,
  );

const makeSelectAttendeeData = () =>
  createSelector(
    selectAtendeeDomain,
    subState => subState.attendeeData,
  );


export default makeSelectAtendee;
export { 
  makeSelectAttendeeData,
  makeSelectEditAttendee,
  makeSelectNewAttendee,
  makeSelectAttendeeDialog,
  makeSelectGetAllAttendees,
  makeSelectLoading,
  makeSelectError,
  selectAtendeeDomain,
 };
