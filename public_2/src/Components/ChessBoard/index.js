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
    for (let i = 72; i > 64; i -= 1) {
      for (let j = 1; j < 9; j += 1) {
        let squareIsBlack = false;
        if (j % 2 === 0 && i % 2 === 0) {
          squareIsBlack = true;
        } else if (j % 2 !== 0 && i % 2 !== 0) {
          squareIsBlack = true;
        }
        board.push({
          position: String.fromCharCode(i) + j,
          black: squareIsBlack,
          movedThrough: false
        });
      }
    }
    return board;
  };

  handleSquareClicked = position => {
    const { startPosition } = this.state;
    if (startPosition === null) {
      this.setState({ startPosition: position });
    } else {
      this.setState({ endPosition: position }, () => {
        this.updateBoardSquares();
      });
    }
  };

  updateBoardSquares = () => {
    const { startPosition, endPosition } = this.state;
    this.setState({
      board: this.state.board.map((square, i) => {
        if (i >= startPosition && i <= endPosition) {
          square.movedThrough = true;
        }
        return square;
      })
    });
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
