import React from "react";
import { connect } from "react-redux";

import { initBoard, setAll, setCurrentPosition } from "../Actions";
import Square from "./Square";

export class ChessBoard extends React.Component {
  componentDidMount() {
    this.props.dispatch(initBoard());
  }

  // Investigate using getDerivedStateFromProps()
  // instead of componentWillReceiveProps().

  componentWillReceiveProps(nextProps) {
    if (this.props.startPosition !== nextProps.current) {
      this.paint(nextProps.current, nextProps.startPosition);
    }
  }

  updateMove(moveType, position) {
    this.props.dispatch(
      setAll(
        this.props.startPosition === null ? position : this.props.endPosition,
        position,
        position,
        this.props.board.map((square, i) => {
          if (this.condition(moveType)(i, this.props.endPosition, position)) {
            // console.log(i, this.props.endPosition, position);
            square.movedThrough = true;
          }
          return square;
        })
      )
    );
  }

  paint = (position, startPosition) => {
    if (startPosition === null) {
      // console.log("place piece");
      this.updateMove("placePiece", position);
    } else if (
      // legal horizontal move right
      position > startPosition &&
      position - startPosition < 8 &&
      position % 8 > startPosition % 8
    ) {
      // console.log("horiz right");
      this.updateMove("horizRight", position);
    } else if (
      // legal horizontal move left
      startPosition > position &&
      startPosition - position < 8 &&
      startPosition % 8 > position % 8
    ) {
      // console.log("horiz left");
      this.updateMove("horizLeft", position);
    } else if (
      // legal vertical move down
      startPosition < position &&
      startPosition % 8 === position % 8
    ) {
      // console.log("vert down");
      this.updateMove("vertDown", position);
    } else if (
      // legal vertical move up
      startPosition > position &&
      startPosition % 8 === position % 8
    ) {
      // console.log("vert up");
      this.updateMove("vertUp", position);
    } else if (
      // legal diagonal move down and right
      position > startPosition &&
      (position - startPosition) % 9 === 0
    ) {
      // console.log("diag down right");
      this.updateMove("diagDownRight", position);
    } else if (
      // legal diagonal move down and left
      position > startPosition &&
      (position - startPosition) % 7 === 0
    ) {
      // console.log("diag down left");
      this.updateMove("diagDownLeft", position);
    } else if (
      // legal diagonal move up and left
      position < startPosition &&
      (startPosition - position) % 9 === 0
    ) {
      // console.log("diag up left");
      this.updateMove("diagUpLeft", position);
    } else if (
      // legal diagonal move up and right
      position < startPosition &&
      (startPosition - position) % 7 === 0
    ) {
      // console.log("diag up right");
      this.updateMove("diagUpRight", position);
    }
  };

  handleSquareClicked = position => {
    this.props.dispatch(setCurrentPosition(position));
  };

  condition = moveType => {
    return (
      {
        placePiece: (i, start, end) => i === end && !start,
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
    moves: state.moves,
    board: state.board,
    startPosition: state.startPosition,
    endPosition: state.endPosition,
    current: state.current
  };
};

export default connect(mapState)(ChessBoard);
