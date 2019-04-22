import { createStore } from 'redux';

import movesReducer from './Reducers/moves.reducer';

const store = createStore(
  movesReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.subscribe(() => {
  // console.log("getState", store.getState());
});
export default store;
