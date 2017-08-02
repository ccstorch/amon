import { SET_PARAMS, CLEAR_PARAMS } from './filtersActions';

const PAGE_SIZE = 10;
const defaultQueryVariables = {
  skip: 0,
  orderBy: 'createdAt_DESC',
}
const defaultState = {};

const cache = (state = defaultState, action) => {
  switch (action.type) {
    case SET_PARAMS:
      var { viewName, params } = action.payload;
      const { skip, orderBy, filters } = params;
      const viewCurrentParams = state[viewName] || {};
      return { ...state, [viewName]: { ...defaultQueryVariables, ...viewCurrentParams, ...params } };

    case CLEAR_PARAMS:
      var viewName = action.payload;
      return { ...state, [viewName]: { ...defaultQueryVariables } };

    default:
      return state;
  }
}

export default cache;
