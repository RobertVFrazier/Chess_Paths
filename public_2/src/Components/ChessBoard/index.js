import React from "react";

import Square from "../Square/";

export default class ChessBoard extends React.Component {
  constructor() {
    super();
    this.state = {
      board: this.initializeBoard(),
      startPosition: null,
      endPosition: null
    };
  }

  initializeBoard = () => {
    const board = [];
    let evensBlack = false;
    let squareIsBlack = false;
    for (let i = 0; i < 64; i += 1) {
      if (evensBlack === true && i % 2 === 0) {
        // even-numbered squares are black
        squareIsBlack = true;
      } else if (evensBlack === false && i % 2 !== 0) {
        // odd-numbered squares are black
        squareIsBlack = true;
      } else squareIsBlack = false;
      board.push({
        position: i,
        black: squareIsBlack,
        movedThrough: false
      });
      if ((i + 1) % 8 === 0) {
        // last square on the current row
        evensBlack = !evensBlack;
      }
    }
    return board;
  };

  updateMove(moveType, position) {
    this.setState({ endPosition: position }, () => {
      const board = [...this.state.board];
      this.updateBoardSquares(moveType, () =>
        this.setState({ startPosition: position, board })
      );
    });
  }

  handleSquareClicked = position => {
    const { startPosition } = this.state;
    if (startPosition === null) {
      // first square clicked
      const board = [...this.state.board];
      board[position].movedThrough = true;
      this.setState({ startPosition: position, board });
    } else if (
      // legal horizontal move right
      position > this.state.startPosition &&
      position - this.state.startPosition < 8 &&
      position % 8 > this.state.startPosition % 8
    ) {
      this.updateMove("horizRight", position);
    } else if (
      // legal horizontal move left
      this.state.startPosition > position &&
      this.state.startPosition - position < 8 &&
      this.state.startPosition % 8 > position % 8
    ) {
      this.updateMove("horizLeft", position);
    } else if (
      // legal vertical move down
      this.state.startPosition < position &&
      this.state.startPosition % 8 === position % 8
    ) {
      this.updateMove("vertDown", position);
    } else if (
      // legal vertical move up
      this.state.startPosition > position &&
      this.state.startPosition % 8 === position % 8
    ) {
      this.updateMove("vertUp", position);
    } else if (
      // legal diagonal move down and right
      position > this.state.startPosition &&
      (position - this.state.startPosition) % 9 === 0
    ) {
      this.updateMove("diagDownRight", position);
    } else if (
      // legal diagonal move down and left
      position > this.state.startPosition &&
      (position - this.state.startPosition) % 7 === 0
    ) {
      this.updateMove("diagDownLeft", position);
    } else if (
      // legal diagonal move up and left
      position < this.state.startPosition &&
      (this.state.startPosition - position) % 9 === 0
    ) {
      this.updateMove("diagUpLeft", position);
    } else if (
      // legal diagonal move up and right
      position < this.state.startPosition &&
      (this.state.startPosition - position) % 7 === 0
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

  updateBoardSquares = (moveType, cb) => {
    const { startPosition, endPosition } = this.state;
    this.setState(
      {
        board: this.state.board.map((square, i) => {
          if (this.condition(moveType)(i, startPosition, endPosition)) {
            square.movedThrough = true;
          }
          return square;
        })
      },
      cb
    );
  };

  render() {
    return (
      <ul className="board">
        {this.state.board.map(square => (
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
