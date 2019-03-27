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
      this.setState({ endPosition: position }, () => {
        const board = [...this.state.board];
        this.updateBoardSquares("horizRight");
        this.setState({ startPosition: position, board });
      });
    } else if (
      // legal horizontal move left
      this.state.startPosition > position &&
      this.state.startPosition - position < 8 &&
      this.state.startPosition % 8 > position % 8
    ) {
      this.setState({ endPosition: position }, () => {
        const board = [...this.state.board];
        this.updateBoardSquares("horizLeft");
        this.setState({ startPosition: position, board });
      });
    } else if (
      // legal vertical move down
      this.state.startPosition < position &&
      this.state.startPosition % 8 === position % 8
    ) {
      this.setState({ endPosition: position }, () => {
        const board = [...this.state.board];
        this.updateBoardSquares("vertDown");
        this.setState({ startPosition: position, board });
      });
    } else if (
      // legal vertical move up
      this.state.startPosition > position &&
      this.state.startPosition % 8 === position % 8
    ) {
      this.setState({ endPosition: position }, () => {
        const board = [...this.state.board];
        this.updateBoardSquares("vertUp");
        this.setState({ startPosition: position, board });
      });
    } else if (
      // legal diagonal move down and right
      position > this.state.startPosition &&
      (position - this.state.startPosition) % 9 === 0
    ) {
      this.setState({ endPosition: position }, () => {
        const board = [...this.state.board];
        this.updateBoardSquares("diagDownRight");
        this.setState({ startPosition: position, board });
      });
    } else if (
      // legal diagonal move down and left
      position > this.state.startPosition &&
      (position - this.state.startPosition) % 7 === 0
    ) {
      this.setState({ endPosition: position }, () => {
        const board = [...this.state.board];
        this.updateBoardSquares("diagDownLeft");
        this.setState({ startPosition: position, board });
      });
    } else if (
      // legal diagonal move up and left
      position < this.state.startPosition &&
      (this.state.startPosition - position) % 9 === 0
    ) {
      this.setState({ endPosition: position }, () => {
        const board = [...this.state.board];
        this.updateBoardSquares("diagUpLeft");
        this.setState({ startPosition: position, board });
      });
    } else if (
      // legal diagonal move up and right
      position < this.state.startPosition &&
      (this.state.startPosition - position) % 7 === 0
    ) {
      this.setState({ endPosition: position }, () => {
        const board = [...this.state.board];
        this.updateBoardSquares("diagUpRight");
        this.setState({ startPosition: position, board });
      });
    }
  };

  updateBoardSquares = moveType => {
    const { startPosition, endPosition } = this.state;
    if (moveType === "horizRight") {
      this.setState({
        board: this.state.board.map((square, i) => {
          if (i >= startPosition && i <= endPosition) {
            square.movedThrough = true;
          }
          return square;
        })
      });
    } else if (moveType === "horizLeft") {
      this.setState({
        board: this.state.board.map((square, i) => {
          if (i >= endPosition && i <= startPosition) {
            square.movedThrough = true;
          }
          return square;
        })
      });
    } else if (moveType === "vertDown") {
      this.setState({
        board: this.state.board.map((square, i) => {
          if (
            i >= startPosition &&
            i <= endPosition &&
            i % 8 === startPosition % 8
          ) {
            square.movedThrough = true;
          }
          return square;
        })
      });
    } else if (moveType === "vertUp") {
      this.setState({
        board: this.state.board.map((square, i) => {
          if (
            i <= startPosition &&
            i >= endPosition &&
            i % 8 === startPosition % 8
          ) {
            square.movedThrough = true;
          }
          return square;
        })
      });
    } else if (moveType === "diagDownRight") {
      this.setState({
        board: this.state.board.map((square, i) => {
          if (
            i >= startPosition &&
            i <= endPosition &&
            (i - startPosition) % 9 === 0
          ) {
            square.movedThrough = true;
          }
          return square;
        })
      });
    } else if (moveType === "diagDownLeft") {
      this.setState({
        board: this.state.board.map((square, i) => {
          if (
            i >= startPosition &&
            i <= endPosition &&
            (i - startPosition) % 7 === 0
          ) {
            square.movedThrough = true;
          }
          return square;
        })
      });
    } else if (moveType === "diagUpLeft") {
      this.setState({
        board: this.state.board.map((square, i) => {
          if (
            i <= startPosition &&
            i >= endPosition &&
            (startPosition - i) % 9 === 0
          ) {
            square.movedThrough = true;
          }
          return square;
        })
      });
    } else if (moveType === "diagUpRight") {
      this.setState({
        board: this.state.board.map((square, i) => {
          if (
            i <= startPosition &&
            i >= endPosition &&
            (startPosition - i) % 7 === 0
          ) {
            square.movedThrough = true;
          }
          return square;
        })
      });
    }
    console.log(this.state.startPosition, this.state.endPosition);
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
