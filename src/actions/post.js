import axios from 'axios';
import {setAlert} from './alert';
import {
    DELETE_POST,
    ADD_POST,
    GET_POSTS,
    GET_POST, 
    POST_ERROR, 
    UPDATE_LIKES} from './types';

// get post

export const getPosts = () => async  dispatch => {
    try {
        const res = await axios.get('/api/posts');
        dispatch({
            type: GET_POSTS,
            payload: res.data

        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
        
    }
}; 

// ADD LIKE

export const addLike = id => async  dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${id}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: {id, likes: res.data}

        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
        
    }
};

// remove likes

export const removeLike = id => async  dispatch => {
    try {
        const res = await axios.put(`api/posts/unlike/${id}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: {id, likes: res.data}

        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
        
    }
};
// DELETE POST

export const deletePost = id => async  dispatch => {
    try {
         await axios.delete(`/api/posts/${id}`);
        dispatch({
            type: DELETE_POST,
            payload: id

        });
        dispatch(setAlert('Post Removed', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
        
    }
};
//ADD POST

export const addPost = formData => async  dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
       const res =  await axios.post('/api/posts', formData, config);
        dispatch({
            type: ADD_POST,
            payload: res.data

        });
        dispatch(setAlert('Post Created', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
        
    }
}; 

//GET POST

export const getPost = id => async  dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);
        dispatch({
            type: GET_POST,
            payload: res.data

        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
        
    }
}; 
