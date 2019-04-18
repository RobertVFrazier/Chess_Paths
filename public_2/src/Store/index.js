import { createStore } from "redux";

import movesReducer from "./Reducers/moves.reducer";

const store = createStore(movesReducer);
store.subscribe(() => {
  console.log(store.getState());
});
export default store;
