/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  // LOAD_REPOS_SUCCESS,
  // LOAD_REPOS,
  // LOAD_REPOS_ERROR,
  // LOAD_USER_STATUS,
} from './constants';

// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  currentUser: false,
  loginDetails: {},
  tokens: false,
  userData: {
    user: '',
  },
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOGIN: {
        return {
          loading: true,
          error: false,
          loginDetails: action.payload,
        };
      }
      case LOGIN_SUCCESS: {
        localStorage.setItem('tokens', JSON.stringify(action.payload));
        return {
          loading: false,
          error: false,
          tokens: action.payload,
        };
      }
      case LOGIN_ERROR: {
        return {
          loading: false,
          error: true,
        };
      }
      // case LOAD_USER_STATUS: {
      //   return {
      //     // ...state,
      //     // loading: false,
      //     // error: false,
      //     userStatus: action.payload,
      //   };
      // }
      // case LOAD_USER_STATUS:
      // draft.userStatus = 'guest';
      // break;

      // case LOAD_REPOS:
      //   draft.loading = true;
      //   draft.error = false;
      //   draft.userData.repositories = false;
      //   break;

      // case LOAD_REPOS_SUCCESS:
      //   draft.userData.repositories = action.repos;
      //   draft.loading = false;
      //   draft.currentUser = action.username;
      //   break;

      // case LOAD_REPOS_ERROR:
      //   draft.error = action.error;
      //   draft.loading = false;
      //   break;
    }
  });

export default appReducer;
