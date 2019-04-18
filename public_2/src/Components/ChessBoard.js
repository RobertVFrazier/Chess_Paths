import React from "react";
import { connect } from "react-redux";

import {
  addMove,
  initBoard,
  setStart,
  setEnd,
  updateSquares
} from "../Actions";
import Square from "./Square";

export class ChessBoard extends React.Component {
  componentDidMount() {
    this.props.dispatch(initBoard());
  }

  updateMove(moveType, position) {
    this.props.dispatch(addMove(position));
    this.props.dispatch(setEnd(position));
    this.props.dispatch(setStart(this.props.endPosition));
    this.updateBoardSquares(moveType);
  }

  handleSquareClicked = position => {
    const { startPosition } = this.props;
    if (this.props.startPosition === null) {
      // first square clicked
      console.log("first click");
      this.props.dispatch(addMove(position));
      this.props.dispatch(setStart(position));
      this.props.dispatch(setEnd(position));
      // Good so far.
    } else if (
      // legal horizontal move right
      position > startPosition &&
      position - startPosition < 8 &&
      position % 8 > startPosition % 8
    ) {
      console.log("horiz right");
      this.updateMove("horizRight", position);
    } else if (
      // legal horizontal move left
      startPosition > position &&
      startPosition - position < 8 &&
      startPosition % 8 > position % 8
    ) {
      console.log("horiz left");
      this.updateMove("horizLeft", position);
    } else if (
      // legal vertical move down
      startPosition < position &&
      startPosition % 8 === position % 8
    ) {
      console.log("vert down");
      this.updateMove("vertDown", position);
    } else if (
      // legal vertical move up
      startPosition > position &&
      startPosition % 8 === position % 8
    ) {
      this.updateMove("vertUp", position);
    } else if (
      // legal diagonal move down and right
      position > startPosition &&
      (position - startPosition) % 9 === 0
    ) {
      this.updateMove("diagDownRight", position);
    } else if (
      // legal diagonal move down and left
      position > startPosition &&
      (position - startPosition) % 7 === 0
    ) {
      this.updateMove("diagDownLeft", position);
    } else if (
      // legal diagonal move up and left
      position < startPosition &&
      (startPosition - position) % 9 === 0
    ) {
      this.updateMove("diagUpLeft", position);
    } else if (
      // legal diagonal move up and right
      position < startPosition &&
      (startPosition - position) % 7 === 0
    ) {
      this.updateMove("diagUpRight", position);
    }
  };

  condition = moveType => {
    return (
      {
        horizRight: (i, start, end) => i >= start && i <= end,
        horizLeft: (i, start, end) => i >= end && i <= start,
        vertDown: (i, start, end) =>
          i >= start && i <= end && i % 8 === start % 8,
        vertUp: (i, start, end) =>
          i <= start && i >= end && i % 8 === start % 8,
        diagDownRight: (i, start, end) =>
          i >= start && i <= end && (i - start) % 9 === 0,
        diagDownLeft: (i, start, end) =>
          i >= start && i <= end && (i - start) % 7 === 0,
        diagUpLeft: (i, start, end) =>
          i <= start && i >= end && (start - i) % 9 === 0,
        diagUpRight: (i, start, end) =>
          i <= start && i >= end && (start - i) % 7 === 0
      }[moveType] || {}
    );
  };

  updateBoardSquares = moveType => {
    const { startPosition, endPosition } = this.props;
    this.props.dispatch(
      updateSquares(
        this.props.board.map((square, i) => {
          if (this.condition(moveType)(i, startPosition, endPosition)) {
            square.movedThrough = true;
          }
          return square;
        })
      )
    );
    console.log(startPosition, endPosition);
  };

  render() {
    // console.log(this.state);
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
    moves: state.moves,
    board: state.board,
    startPosition: state.startPosition,
    endPosition: state.endPosition
  };
};

export default connect(mapState)(ChessBoard);
