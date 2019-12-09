/*
 *
 * AllPosts reducer
 *
 */
import produce from 'immer';
import {
  OPEN_NEW_POST_DIALOG,
  CLOSE_NEW_POST_DIALOG,
  OPEN_EDIT_POST_DIALOG,
  CLOSE_EDIT_POST_DIALOG,
  GET_ALL_POSTS,
  GET_ALL_POSTS_SUCCESS,
  GET_ALL_POSTS_ERROR,
  SAVE_NEW_POST,
  SAVE_NEW_POST_SUCCESS,
  SAVE_NEW_POST_ERROR,
  UPDATE_POST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_ERROR,
  DELETE_POST,
  DELETE_POST_SUCCESS,
  DELETE_POST_ERROR,
  ATTENDEES_VIEW,
  ATTENDEES_LIST,
  ATTENDEES_LIST_SUCCESS,
  ATTENDEES_LIST_ERROR,
  OPEN_ADD_ATTENDEE_DIALOG,
  CLOSE_ADD_ATTENDEE_DIALOG,
  SAVE_ATTENDEE,
  SAVE_ATTENDEE_SUCCESS,
  SAVE_ATTENDEE_ERROR,
} from './constants';

export const initialState = {
  newAttendee: {},
  getAllPosts: [],
  attendeesList: [],
  newPost: {},
  attendeesView: {},
  postData: {},
  loading: false,
  error: false,
  postDialog: {
    type: 'new',
    props: {
      open: false,
    },
    data: null,
  },
  attendeeDialog: {
    type: 'new',
    props: {
      open: false,
    },
    data: null,
  },
};

/* eslint-disable default-case, no-param-reassign */
const allPostsReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_ALL_POSTS: {
        return {
          ...state,
          loading: true,
          error: false,
          // getAllPosts: [],
        };
      }
      case GET_ALL_POSTS_SUCCESS: {
        return {
          ...state,
          loading: false,
          error: false,
          getAllPosts: action.payload,
          draft: { 'draft.getAllPosts': action.payload },
        };
      }
      case GET_ALL_POSTS_ERROR: {
        return {
          ...state,
          loading: false,
          error: false,
        };
      }
      case OPEN_NEW_POST_DIALOG: {
        return {
          ...state,
          postDialog: {
            type: 'new',
            props: {
              open: true,
            },
            data: null,
          },
        };
      }
      case CLOSE_NEW_POST_DIALOG: {
        return {
          ...state,
          postDialog: {
            type: 'new',
            props: {
              open: false,
            },
            data: null,
          },
        };
      }
      case SAVE_NEW_POST: {
        return {
          ...state,
          loading: true,
          error: false,
          newPost: action.payload,
        };
      }
      case SAVE_NEW_POST_SUCCESS: {
        return {
          ...state,
          loading: false,
          error: false,
          // getAllPosts: state.getAllPosts.concat(action.payload),
        };
      }
      case SAVE_NEW_POST_ERROR: {
        return {
          ...state,
          loading: false,
          error: true,
        };
      }
      case OPEN_EDIT_POST_DIALOG: {
        return {
          ...state,
          postDialog: {
            type: 'edit',
            props: {
              open: true,
            },
            data: action.payload,
          },
        };
      }
      case CLOSE_EDIT_POST_DIALOG: {
        return {
          ...state,
          postDialog: {
            type: 'edit',
            props: {
              open: false,
            },
            data: null,
          },
        };
      }
      case UPDATE_POST: {
        return {
          ...state,
          loading: true,
          error: false,
          postData: action.payload,
        };
      }
      case UPDATE_POST_SUCCESS: {
        return {
          ...state,
          loading: false,
          error: false,
          // getAllPosts: state.getAllPosts.concat(action.payload),
        };
      }
      case UPDATE_POST_ERROR: {
        return {
          ...state,
          loading: false,
          error: true,
        };
      }
      case DELETE_POST: {
        return {
          ...state,
          loading: true,
          error: false,
          postData: action.payload,
        };
      }
      case DELETE_POST_SUCCESS: {
        return {
          ...state,
          loading: false,
          error: false,
          // getAllPosts: state.getAllPosts.concat(action.payload),
        };
      }
      case DELETE_POST_ERROR: {
        return {
          ...state,
          loading: false,
          error: true,
        };
      }
      case ATTENDEES_VIEW: {
        return {
          ...state,
          attendeesView: action.payload,
        };
      }
      case ATTENDEES_LIST: {
        return {
          ...state,
          loading: true,
          error: false,
          attendeesView: action.payload,
        };
      }
      case ATTENDEES_LIST_SUCCESS: {
        return {
          ...state,
          loading: false,
          error: false,
          attendeesList: action.payload,
        };
      }
      case ATTENDEES_LIST_ERROR: {
        return {
          ...state,
          loading: false,
          error: true,
        };
      }
      case OPEN_ADD_ATTENDEE_DIALOG: {
        return {
          ...state,
          attendeeDialog: {
            type: 'new',
            props: {
              open: true,
            },
            data: null,
          },
        };
      }
      case CLOSE_ADD_ATTENDEE_DIALOG: {
        return {
          ...state,
          attendeeDialog: {
            type: 'new',
            props: {
              open: false,
            },
            data: null,
          },
        };
      }
      case SAVE_ATTENDEE: {
        return {
          ...state,
          loading: true,
          error: false,
          newAttendee: action.payload,
        };
      }
      case SAVE_ATTENDEE_SUCCESS: {
        return {
          ...state,
          loading: false,
          error: false,
        };
      }
      case SAVE_ATTENDEE_ERROR: {
        return {
          ...state,
          loading: false,
          error: true,
        };
      }
    }
  });

export default allPostsReducer;
