import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the allPosts state domain
 */

const selectAllPostsDomain = state => state.allPosts || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AllPosts
 */

const makeSelectAllPosts = () =>
  createSelector(
    selectAllPostsDomain,
    substate => substate,
  );

const makeSelectGetAllPosts = () =>
  createSelector(
    selectAllPostsDomain,
    subState => subState.getAllPosts,
  );

const makeSelectLoading = () =>
  createSelector(
    selectAllPostsDomain,
    subState => subState.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectAllPostsDomain,
    subState => subState.error,
  );

const makeSelectPostDialog = () =>
  createSelector(
    selectAllPostsDomain,
    subState => subState.postDialog,
  );

const makeSelectNewPost = () =>
  createSelector(
    selectAllPostsDomain,
    subState => subState.newPost,
  );

const makeSelectEditPost = () =>
  createSelector(
    selectAllPostsDomain,
    subState => subState.postDialog,
  );

const makeSelectPostData = () =>
  createSelector(
    selectAllPostsDomain,
    subState => subState.postData,
  );

const makeSelectAttendeesView = () =>
  createSelector(
    selectAllPostsDomain,
    subState => subState.attendeesView,
  );

const makeSelectGetAttendeesList = () =>
  createSelector(
    selectAllPostsDomain,
    subState => subState.attendeesList,
  );

const makeSelectNewAttendee = () =>
  createSelector(
    selectAllPostsDomain,
    subState => subState.newAttendee,
  );

const makeSelectAddAttendeeDialog = () =>
  createSelector(
    selectAllPostsDomain,
    subState => subState.attendeeDialog,
  );

export default makeSelectAllPosts;
export {
  makeSelectNewAttendee,
  makeSelectAddAttendeeDialog,
  makeSelectAttendeesView,
  makeSelectGetAttendeesList,
  makeSelectPostData,
  makeSelectEditPost,
  makeSelectNewPost,
  makeSelectPostDialog,
  makeSelectGetAllPosts,
  makeSelectLoading,
  makeSelectError,
  selectAllPostsDomain,
};
