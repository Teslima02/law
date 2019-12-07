/*
 *
 * AllPosts actions
 *
 */

import {
  OPEN_NEW_POST_DIALOG,
  CLOSE_NEW_POST_DIALOG,
  OPEN_EDIT_POST_DIALOG,
  CLOSE_EDIT_POST_DIALOG,
  SAVE_NEW_POST,
  GET_ALL_POSTS,
  GET_ALL_POSTS_SUCCESS,
  GET_ALL_POSTS_ERROR,
  SAVE_NEW_POST_SUCCESS,
  SAVE_NEW_POST_ERROR,
  UPDATE_POST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_ERROR,
  DELETE_POST,
  DELETE_POST_SUCCESS,
  DELETE_POST_ERROR,
} from './constants';

export function openNewPostDialog() {
  return {
    type: OPEN_NEW_POST_DIALOG,
  };
}

export function closeNewPostDialog() {
  return {
    type: CLOSE_NEW_POST_DIALOG,
  };
}

export function openEditPostDialog(data) {
  return {
    type: OPEN_EDIT_POST_DIALOG,
    payload: data,
  };
}

export function closeEditPostDialog() {
  return {
    type: CLOSE_EDIT_POST_DIALOG,
  };
}

export function allPosts() {
  return {
    type: GET_ALL_POSTS,
  };
}

export function allPostsSuccess(data) {
  return {
    type: GET_ALL_POSTS_SUCCESS,
    payload: data,
  };
}

export function allPostsError(data) {
  return {
    type: GET_ALL_POSTS_ERROR,
    payload: data,
  };
}

export function saveNewPost(data) {
  return {
    type: SAVE_NEW_POST,
    payload: data,
  };
}

export function saveNewPostSuccess(data) {
  return {
    type: SAVE_NEW_POST_SUCCESS,
    payload: data,
  };
}

export function saveNewPostError(data) {
  return {
    type: SAVE_NEW_POST_ERROR,
    payload: data,
  };
}

export function updatePost(data) {
  return {
    type: UPDATE_POST,
    payload: data,
  };
}

export function updatePostSuccess(data) {
  return {
    type: UPDATE_POST_SUCCESS,
    payload: data,
  };
}

export function updatePostError(data) {
  return {
    type: UPDATE_POST_ERROR,
    payload: data,
  };
}

export function deletePost(data) {
  return {
    type: DELETE_POST,
    payload: data,
  };
}

export function deletePostSuccess(data) {
  return {
    type: DELETE_POST_SUCCESS,
    payload: data,
  };
}

export function deletePostError(data) {
  return {
    type: DELETE_POST_ERROR,
    payload: data,
  };
}
