/*
 *
 * Atendee reducer
 *
 */
import produce from 'immer';
import {
  OPEN_NEW_ATTENDEE_DIALOG,
  CLOSE_NEW_ATTENDEE_DIALOG,
  OPEN_EDIT_ATTENDEE_DIALOG,
  CLOSE_EDIT_ATTENDEE_DIALOG,
  SAVE_NEW_ATTENDEE,
  GET_ALL_ATTENDEES,
  GET_ALL_ATTENDEES_SUCCESS,
  GET_ALL_ATTENDEES_ERROR,
  SAVE_NEW_ATTENDEE_SUCCESS,
  SAVE_NEW_ATTENDEE_ERROR,
  UPDATE_ATTENDEE,
  UPDATE_ATTENDEE_SUCCESS,
  UPDATE_ATTENDEE_ERROR,
  DELETE_ATTENDEE,
  DELETE_ATTENDEE_SUCCESS,
  DELETE_ATTENDEE_ERROR,
} from './constants';

export const initialState = {
  getAllAttendees: [],
  newAttendee: {},
  // updatePost: {},
  attendeeData: {},
  loading: false,
  error: false,
  attendeeDialog: {
    type: 'new',
    props: {
      open: false,
    },
    data: null,
  },
};
/* eslint-disable default-case, no-param-reassign */
const atendeeReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_ALL_ATTENDEES: {
        return {
          ...state,
          loading: true,
          error: false,
          // getAllAttendees: [],
        };
      }
      case GET_ALL_ATTENDEES_SUCCESS: {
        return {
          ...state,
          loading: false,
          error: false,
          getAllAttendees: action.payload,
          draft: { 'draft.getAllAttendees': action.payload },
        };
      }
      case GET_ALL_ATTENDEES_ERROR: {
        return {
          ...state,
          loading: false,
          error: false,
        };
      }
      case OPEN_NEW_ATTENDEE_DIALOG: {
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
      case CLOSE_NEW_ATTENDEE_DIALOG: {
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
      case SAVE_NEW_ATTENDEE: {
        return {
          ...state,
          loading: true,
          error: false,
          newAttendee: action.payload,
        };
      }
      case SAVE_NEW_ATTENDEE_SUCCESS: {
        return {
          ...state,
          loading: false,
          error: false,
          // getAllAttendees: state.getAllAttendees.concat(action.payload),
        };
      }
      case SAVE_NEW_ATTENDEE_ERROR: {
        return {
          ...state,
          loading: false,
          error: true,
        };
      }
      case OPEN_EDIT_ATTENDEE_DIALOG: {
        return {
          ...state,
          attendeeDialog: {
            type: 'edit',
            props: {
              open: true,
            },
            data: action.payload,
          },
        };
      }
      case CLOSE_EDIT_ATTENDEE_DIALOG: {
        return {
          ...state,
          attendeeDialog: {
            type: 'edit',
            props: {
              open: false,
            },
            data: null,
          },
        };
      }
      case UPDATE_ATTENDEE: {
        return {
          ...state,
          loading: true,
          error: false,
          attendeeData: action.payload,
        };
      }
      case UPDATE_ATTENDEE_SUCCESS: {
        return {
          ...state,
          loading: false,
          error: false,
          // getAllAttendees: state.getAllAttendees.concat(action.payload),
        };
      }
      case UPDATE_ATTENDEE_ERROR: {
        return {
          ...state,
          loading: false,
          error: true,
        };
      }
      case DELETE_ATTENDEE: {
        return {
          ...state,
          loading: true,
          error: false,
          attendeeData: action.payload,
        };
      }
      case DELETE_ATTENDEE_SUCCESS: {
        return {
          ...state,
          loading: false,
          error: false,
          // getAllAttendees: state.getAllAttendees.concat(action.payload),
        };
      }
      case DELETE_ATTENDEE_ERROR: {
        return {
          ...state,
          loading: false,
          error: true,
        };
      }
    }
  });

export default atendeeReducer;
