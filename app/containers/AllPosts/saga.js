import {
  take,
  call,
  put,
  select,
  takeLatest,
  actionChannel,
} from 'redux-saga/effects';
import {
  GET_ALL_POSTS,
  SAVE_NEW_POST,
  UPDATE_POST,
  DELETE_POST,
} from './constants';
import request from '../../utils/request';
import * as Actions from './actions';

import { makeSelectNewPost, makeSelectPostData } from './selectors';
import { BaseUrl } from '../../components/BaseUrl';

// Individual exports for testing
export function* getAllPosts() {
  const requestURL = `${BaseUrl}/talk`;

  try {
    const allPostsResponse = yield call(request, requestURL);

    console.log(allPostsResponse, 'allPostsResponse');
    yield put(Actions.allPostsSuccess(allPostsResponse));
  } catch (err) {
    yield put(Actions.allPostsError(err));
  }
}

export function* saveNewPost() {
  const newPostData = yield select(makeSelectNewPost());

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
  const updatePostData = yield select(makeSelectPostData());

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
  const updatePostData = yield select(makeSelectPostData());

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

export default function* posts() {
  yield takeLatest(GET_ALL_POSTS, getAllPosts);
  yield takeLatest(SAVE_NEW_POST, saveNewPost);
  yield takeLatest(UPDATE_POST, updatePost);
  yield takeLatest(DELETE_POST, deletePost);
}
