import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  GET_ALL_ATTENDEES,
  SAVE_NEW_ATTENDEE,
  UPDATE_ATTENDEE,
  DELETE_ATTENDEE,
} from './constants';
import request from '../../utils/request';
import * as Actions from './actions';

import * as Selectors from './selectors';
import { BaseUrl } from '../../components/BaseUrl';

// Individual exports for testing
export function* getAllAttendees() {
  const requestURL = `${BaseUrl}/attendee`;

  try {
    const allAttendeesResponse = yield call(request, requestURL);

    yield put(Actions.allAttendeesSuccess(allAttendeesResponse));
  } catch (err) {
    yield put(Actions.allAttendeesError(err));
  }
}

export function* saveNewAttendee() {
  const newAttendeeData = yield select(Selectors.makeSelectNewAttendee());

  const requestURL = `${BaseUrl}/attendee`;

  try {
    const newAttendeesRequ = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(newAttendeeData),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        // 'Access-Control-Allow-Origin': '*',
        // Authorization: `Bearer ${token}`,
      },
    });

    yield put(Actions.allAttendees());
    yield put(Actions.saveNewAttendeeSuccess(newAttendeesRequ.data));
  } catch (err) {
    yield put(Actions.saveNewAttendeeError(err));
  }
}

export function* updateAttendee() {
  const updateAttendeeData = yield select(Selectors.makeSelectAttendeeData());

  // eslint-disable-next-line no-underscore-dangle
  const requestURL = `${BaseUrl}/attendee/${updateAttendeeData._id}`;

  try {
    const updateAttendeesRequ = yield call(request, requestURL, {
      method: 'PUT',
      body: JSON.stringify(updateAttendeeData),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        // 'Access-Control-Allow-Origin': '*',
        // Authorization: `Bearer ${token}`,
      },
    });

    yield put(Actions.allAttendees());
    yield put(Actions.updateAttendeeSuccess(updateAttendeesRequ.data));
  } catch (err) {
    yield put(Actions.updateAttendeeError(err));
  }
}

export function* deleteAttendee() {
  const updateAttendeeData = yield select(Selectors.makeSelectAttendeeData());

  // eslint-disable-next-line no-underscore-dangle
  const requestURL = `${BaseUrl}/attendee/${updateAttendeeData._id}`;

  try {
    const deleteAttendeesRequ = yield call(request, requestURL, {
      method: 'DELETE',
      // eslint-disable-next-line no-underscore-dangle
      body: JSON.stringify(updateAttendeeData._id),
    });

    yield put(Actions.allAttendees());
    yield put(Actions.deleteAttendeeSuccess(deleteAttendeesRequ));
  } catch (err) {
    yield put(Actions.updateAttendeeError(err));
  }
}

export default function* Attendees() {
  yield takeLatest(GET_ALL_ATTENDEES, getAllAttendees);
  yield takeLatest(SAVE_NEW_ATTENDEE, saveNewAttendee);
  yield takeLatest(UPDATE_ATTENDEE, updateAttendee);
  yield takeLatest(DELETE_ATTENDEE, deleteAttendee);
}
