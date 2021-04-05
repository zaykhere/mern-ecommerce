import { ADMIN_UPDATE_FAIL, ADMIN_UPDATE_REQUEST, ADMIN_UPDATE_SUCCESS, USER_DELETE_FAIL, USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_LIST_FAIL, USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_UPDATE_FAIL, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS } from "../constants/userConstants";
import axios from "axios";
import {api} from '../api';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST
    })

    const config = {
      headers: {
        'Content-Type' : 'application/json'
      }
    }

    const { data } = await axios.post(`${api}/api/users/login`, { email, password }, config);

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    })

    localStorage.setItem('userInfo', JSON.stringify(data));

  }
  catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response && error.response.data.error ? error.response.data.error : error.message
    })
  }
}

export const register = (name,email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST
    })

    const config = {
      headers: {
        'Content-Type' : 'application/json'
      }
    }

    const { data } = await axios.post(`${api}/api/users`, { name, email, password }, config);
    
    console.log(data);

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data
    })

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload:data
    })

    localStorage.setItem('userInfo', JSON.stringify(data));

  }
  catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response && error.response.data.error ? error.response.data.error : error.message
    })
  }
}

// Update User Profile
export const getUserDetails = (id) => async (dispatch,getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST
    })

    const { userLogin: { userInfo } } = getState();


    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization : `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(`${api}/api/users/${id}`, config);

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data
    })

  }
  catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response && error.response.data.error ? error.response.data.error : error.message
    })
  }
}

// Actually update the user profile
export const updateUserProfile = (user) => async (dispatch,getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST
    })

    const { userLogin: { userInfo } } = getState();


    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const { data } = await axios.put(`${api}/api/users/profile`, user,config);

    dispatch({
      type: USER_UPDATE_SUCCESS,
      payload: data
    })

  }
  catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response && error.response.data.error ? error.response.data.error : error.message
    })
  }
}

// List Users 
export const listUsers = () => async (dispatch,getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST
    })

    const { userLogin: { userInfo } } = getState();


    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(`${api}/api/users`,config);

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data
    })

  }
  catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload: error.response && error.response.data.error ? error.response.data.error : error.message
    })
  }
}

// Delete Users 
export const deleteUser = (id) => async (dispatch,getState) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST
    })

    const { userLogin: { userInfo } } = getState();


    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.delete(`${api}/api/users/${id}`,config);

    dispatch({type: USER_DELETE_SUCCESS})

  }
  catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload: error.response && error.response.data.error ? error.response.data.error : error.message
    })
  }
}

// Update User by Admin
export const adminUpdateUser = (user) => async (dispatch,getState) => {
  try {
    dispatch({
      type: ADMIN_UPDATE_REQUEST
    })

    const { userLogin: { userInfo } } = getState();


    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.put(`${api}/api/users/${user._id}`,user,config);

    dispatch({ type: ADMIN_UPDATE_SUCCESS })
    dispatch({type: USER_DETAILS_SUCCESS, payload: data})

  }
  catch (error) {
    dispatch({
      type: ADMIN_UPDATE_FAIL,
      payload: error.response && error.response.data.error ? error.response.data.error : error.message
    })
  }
}


export const logout = () => async (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({type: USER_LOGOUT})
}

