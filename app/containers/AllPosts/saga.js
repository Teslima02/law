import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  GET_ALL_POSTS,
  SAVE_NEW_POST,
  UPDATE_POST,
  DELETE_POST,
  ATTENDEES_LIST,
  SAVE_ATTENDEE,
} from './constants';
import request from '../../utils/request';
import * as Actions from './actions';
import * as AttendeesActions from '../Atendee/actions';

import * as Selectors from './selectors';
import { BaseUrl } from '../../components/BaseUrl';

// Individual exports for testing
export function* getAllPosts() {
  const requestURL = `${BaseUrl}/talk`;

  try {
    const allPostsResponse = yield call(request, requestURL);

    // console.log(allPostsResponse, 'allPostsResponse');
    yield put(Actions.allPostsSuccess(allPostsResponse));
  } catch (err) {
    yield put(Actions.allPostsError(err));
  }
}

export function* saveNewPost() {
  const newPostData = yield select(Selectors.makeSelectNewPost());

  const requestURL = `${BaseUrl}/talk`;

  try {
    const newPostsRequ = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(newPostData),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        // 'Access-Control-Allow-Origin': '*',
        // Authorization: `Bearer ${token}`,
      },
    });

    yield put(Actions.allPosts());
    yield put(Actions.saveNewPostSuccess(newPostsRequ.data));
  } catch (err) {
    yield put(Actions.saveNewPostError(err));
  }
}

export function* updatePost() {
  const updatePostData = yield select(Selectors.makeSelectPostData());

  // eslint-disable-next-line no-underscore-dangle
  const requestURL = `${BaseUrl}/talk/${updatePostData._id}`;

  try {
    const updatePostsRequ = yield call(request, requestURL, {
      method: 'PUT',
      body: JSON.stringify(updatePostData),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        // 'Access-Control-Allow-Origin': '*',
        // Authorization: `Bearer ${token}`,
      },
    });

    yield put(Actions.allPosts());
    yield put(Actions.updatePostSuccess(updatePostsRequ.data));
  } catch (err) {
    yield put(Actions.updatePostError(err));
  }
}

export function* deletePost() {
  const updatePostData = yield select(Selectors.makeSelectPostData());

  // eslint-disable-next-line no-underscore-dangle
  const requestURL = `${BaseUrl}/talk/${updatePostData._id}`;

  try {
    const deletePostsRequ = yield call(request, requestURL, {
      method: 'DELETE',
      // eslint-disable-next-line no-underscore-dangle
      body: JSON.stringify(updatePostData._id),
    });

    yield put(Actions.allPosts());
    yield put(Actions.deletePostSuccess(deletePostsRequ));
  } catch (err) {
    yield put(Actions.updatePostError(err));
  }
}

export function* attendeesList() {
  const talkId = yield select(Selectors.makeSelectAttendeesView());

  // eslint-disable-next-line no-underscore-dangle
  const requestURL = `${BaseUrl}/talk/${talkId}`;

  try {
    const deletePostsRequ = yield call(request, requestURL);

    yield put(Actions.getAttendeesListSuccess(deletePostsRequ));
  } catch (err) {
    yield put(Actions.getAttendeesListError(err));
  }
}

export function* saveAttendee() {
  const talkId = yield select(Selectors.makeSelectAttendeesView());
  const newAttendee = yield select(Selectors.makeSelectNewAttendee());

  // eslint-disable-next-line no-underscore-dangle
  const requestURL = `${BaseUrl}/talk/add/attendee/${talkId}`;

  try {
    const newPostsRequ = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(newAttendee),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    });

    yield put(Actions.getAttendeesList(talkId));
    yield put(Actions.getAttendeesListSuccess(newPostsRequ.data));
  } catch (err) {
    yield put(Actions.getAttendeesListError(err));
  }
}

export default function* posts() {
  yield takeLatest(GET_ALL_POSTS, getAllPosts);
  yield takeLatest(SAVE_NEW_POST, saveNewPost);
  yield takeLatest(UPDATE_POST, updatePost);
  yield takeLatest(DELETE_POST, deletePost);
  yield takeLatest(ATTENDEES_LIST, attendeesList);
  yield takeLatest(SAVE_ATTENDEE, saveAttendee);
}
