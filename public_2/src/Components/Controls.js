import React from "react";
import { connect } from "react-redux";
import className from "classnames";

import { undoMove, redoMove, clearSquares, repaintSquares } from "../Actions";

function mapStateToProps(state) {
  return {
    moves: state.moves,
    redo: state.redo
  };
}

class Controls extends React.Component {
  undoMove = () => {
    this.props.dispatch(undoMove());
    this.props.dispatch(clearSquares());
    this.props.dispatch(repaintSquares());
    this.logs();
  };

  redoMove = () => {
    this.props.dispatch(redoMove());
    this.props.dispatch(clearSquares());
    this.props.dispatch(repaintSquares());
    this.logs();
  };

  logs() {
    console.log(this.props.moves, this.props.redo);
  }

  render() {
    return (
      <div className={className("controls")}>
        <div>
          <button onClick={this.undoMove}>Undo</button>
          <button onClick={this.redoMove}>Redo</button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Controls);
