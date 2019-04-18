import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";

import store from "./Store";

import Interface from "./Components/Interface";
import ChessBoard from "./Components/ChessBoard";

import "./styles.css";

import * as serviceWorker from "./serviceWorker";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Interface />
          <ChessBoard />
        </div>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
