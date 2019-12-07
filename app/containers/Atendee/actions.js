/*
 *
 * Atendee actions
 *
 */

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


export function openNewAttendeeDialog() {
  return {
    type: OPEN_NEW_ATTENDEE_DIALOG,
  };
}

export function closeNewAttendeeDialog() {
  return {
    type: CLOSE_NEW_ATTENDEE_DIALOG,
  };
}

export function openEditAttendeeDialog(data) {
  return {
    type: OPEN_EDIT_ATTENDEE_DIALOG,
    payload: data,
  };
}

export function closeEditAttendeeDialog() {
  return {
    type: CLOSE_EDIT_ATTENDEE_DIALOG,
  };
}

export function allAttendees() {
  return {
    type: GET_ALL_ATTENDEES,
  };
}

export function allAttendeesSuccess(data) {
  return {
    type: GET_ALL_ATTENDEES_SUCCESS,
    payload: data,
  };
}

export function allAttendeesError(data) {
  return {
    type: GET_ALL_ATTENDEES_ERROR,
    payload: data,
  };
}

export function saveNewAttendee(data) {
  return {
    type: SAVE_NEW_ATTENDEE,
    payload: data,
  };
}

export function saveNewAttendeeSuccess(data) {
  return {
    type: SAVE_NEW_ATTENDEE_SUCCESS,
    payload: data,
  };
}

export function saveNewAttendeeError(data) {
  return {
    type: SAVE_NEW_ATTENDEE_ERROR,
    payload: data,
  };
}

export function updateAttendee(data) {
  return {
    type: UPDATE_ATTENDEE,
    payload: data,
  };
}

export function updateAttendeeSuccess(data) {
  return {
    type: UPDATE_ATTENDEE_SUCCESS,
    payload: data,
  };
}

export function updateAttendeeError(data) {
  return {
    type: UPDATE_ATTENDEE_ERROR,
    payload: data,
  };
}

export function deleteAttendee(data) {
  return {
    type: DELETE_ATTENDEE,
    payload: data,
  };
}

export function deleteAttendeeSuccess(data) {
  return {
    type: DELETE_ATTENDEE_SUCCESS,
    payload: data,
  };
}

export function deleteAttendeeError(data) {
  return {
    type: DELETE_ATTENDEE_ERROR,
    payload: data,
  };
}
