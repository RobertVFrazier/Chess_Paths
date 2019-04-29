import React from "react";
import { connect } from "react-redux";

import {
  initBoard,
  addMove,
  setPositions,
  highlightSquares,
  updateScoreboard
} from "../Actions";
import Square from "./Square";

export class ChessBoard extends React.Component {
  componentDidMount() {
    this.props.dispatch(initBoard());
  }

  handleSquareClicked = position => {
    this.props.dispatch(addMove(position));
    this.props.dispatch(setPositions(position));
    this.props.dispatch(highlightSquares(position));
    this.props.dispatch(updateScoreboard());
  };

  render() {
    return (
      <ul className="board">
        {this.props.board.map(square => (
          <Square
            handleSquareClicked={this.handleSquareClicked}
            key={square.position}
            {...square}
          />
        ))}
      </ul>
    );
  }
}

const mapState = state => {
  return {
    board: state.board
  };
};

export default connect(mapState)(ChessBoard);
