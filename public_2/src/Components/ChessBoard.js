import React from "react";
import { connect } from "react-redux";
import queenStanding from "../Images/Queen_Standing.svg";
import {
  initBoard,
  addMove,
  setPositions,
  highlightSquares,
  updateScoreboard
} from "../Actions";
import Square from "./Square";

export class ChessBoard extends React.Component {
  constructor() {
    super();
    this.queenContainer = null;
  }
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
      <div>
        <ul className="board">
          {this.props.board.map(square => (
            <Square
              queenContainer={this.queenContainer}
              handleSquareClicked={this.handleSquareClicked}
              key={square.position}
              ref={this[`refSquare${square.position}`]}
              {...square}
            />
          ))}
        </ul>
        <img
          src={queenStanding}
          alt=""
          className="queen"
          ref={img => (this.queenContainer = img)}
        />
      </div>
    );
  }
}

const mapState = state => {
  return {
    board: state.board
  };
};

export default connect(mapState)(ChessBoard);
