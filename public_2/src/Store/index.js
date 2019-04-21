import { createStore } from "redux";

import movesReducer from "./Reducers/moves.reducer";

const store = createStore(movesReducer);
store.subscribe(() => {
  // console.log("getState", store.getState());
});
export default store;
