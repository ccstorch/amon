import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import filters from './redux/filtersReducers'

export default combineReducers({
  routing: routerReducer,
  filters
})
