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
import {
  allPosts,
  allPostsSuccess,
  allPostsError,
  saveNewPostSuccess,
  saveNewPostError,
  updatePostSuccess,
  updatePostError,
  deletePostSuccess,
} from './actions';
import { makeSelectNewPost, makeSelectPostData } from './selectors';
import { BaseUrl } from '../../components/BaseUrl';

// Individual exports for testing
export function* getAllPosts() {
  const requestURL = `${BaseUrl}/posts`;

  try {
    const allPostsResponse = yield call(request, requestURL);

    console.log(allPostsResponse, 'allPostsResponse');
    yield put(allPostsSuccess(allPostsResponse));
  } catch (err) {
    yield put(allPostsError(err));
  }
}

export function* saveNewPost() {
  const newPostData = yield select(makeSelectNewPost());

  const requestURL = `${BaseUrl}/posts`;

  try {
    const newPostsRequ = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(newPostData),
    });

    yield put(saveNewPostSuccess(newPostsRequ));
  } catch (err) {
    yield put(saveNewPostError(err));
  }
}

export function* updatePost() {
  const updatePostData = yield select(makeSelectPostData());

  console.log(updatePostData, 'updatePostData');

  // const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  // const url = "https://example.com";

  // const requestURL = `http://127.0.0.1:8081/posts/${updatePostData.id}`;

  const requestURL = `${BaseUrl}/posts/${updatePostData.id}`;

  console.log(requestURL, 'requestURL');

  try {
    const updatePostsRequ = yield call(request, requestURL, {
      method: 'PUT',
      body: JSON.stringify(updatePostData),
      // headers: {
      // Accept: 'application/json',
      // 'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
      // },
    });

    yield put(updatePostSuccess(updatePostsRequ));
  } catch (err) {
    yield put(updatePostError(err));
  }
}

export function* deletePost() {
  const data = yield select(makeSelectPostData());

  console.log(data, 'data');

  const requestURL = `http://127.0.0.1:8081/article/${data.id}`;

  console.log(requestURL, 'requestURL');

  try {
    const deletePostsRequ = yield call(request, requestURL, {
      method: 'DELETE',
      body: JSON.stringify(data.id),
    });

    yield put(deletePostSuccess(deletePostsRequ));
  } catch (err) {
    yield put(updatePostError(err));
  }
}

export default function* posts() {
  yield takeLatest(GET_ALL_POSTS, getAllPosts);
  yield takeLatest(SAVE_NEW_POST, saveNewPost);
  yield takeLatest(UPDATE_POST, updatePost);
  yield takeLatest(DELETE_POST, deletePost);
}
