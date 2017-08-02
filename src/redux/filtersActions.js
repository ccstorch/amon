import _ from 'lodash';
import store from '../store';

export const SET_PARAMS = 'SET_PARAMS';
export const setParams = (viewName, params) => ({ type: SET_PARAMS, payload: { viewName, params } });

export const CLEAR_PARAMS = 'CLEAR_PARAMS';
export const clearParams = (viewName) => ({ type: CLEAR_PARAMS, payload: viewName });
