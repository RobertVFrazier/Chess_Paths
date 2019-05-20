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
    this.refSquare0 = React.createRef();
    this.refSquare1 = React.createRef();
    this.refSquare2 = React.createRef();
    this.refSquare3 = React.createRef();
    this.refSquare4 = React.createRef();
    this.refSquare5 = React.createRef();
    this.refSquare6 = React.createRef();
    this.refSquare7 = React.createRef();
    this.refSquare8 = React.createRef();
    this.refSquare9 = React.createRef();
    this.refSquare10 = React.createRef();
    this.refSquare11 = React.createRef();
    this.refSquare12 = React.createRef();
    this.refSquare13 = React.createRef();
    this.refSquare14 = React.createRef();
    this.refSquare15 = React.createRef();
    this.refSquare16 = React.createRef();
    this.refSquare17 = React.createRef();
    this.refSquare18 = React.createRef();
    this.refSquare19 = React.createRef();
    this.refSquare20 = React.createRef();
    this.refSquare21 = React.createRef();
    this.refSquare22 = React.createRef();
    this.refSquare23 = React.createRef();
    this.refSquare24 = React.createRef();
    this.refSquare25 = React.createRef();
    this.refSquare26 = React.createRef();
    this.refSquare27 = React.createRef();
    this.refSquare28 = React.createRef();
    this.refSquare29 = React.createRef();
    this.refSquare30 = React.createRef();
    this.refSquare31 = React.createRef();
    this.refSquare32 = React.createRef();
    this.refSquare33 = React.createRef();
    this.refSquare34 = React.createRef();
    this.refSquare35 = React.createRef();
    this.refSquare36 = React.createRef();
    this.refSquare37 = React.createRef();
    this.refSquare38 = React.createRef();
    this.refSquare39 = React.createRef();
    this.refSquare40 = React.createRef();
    this.refSquare41 = React.createRef();
    this.refSquare42 = React.createRef();
    this.refSquare43 = React.createRef();
    this.refSquare44 = React.createRef();
    this.refSquare45 = React.createRef();
    this.refSquare46 = React.createRef();
    this.refSquare47 = React.createRef();
    this.refSquare48 = React.createRef();
    this.refSquare49 = React.createRef();
    this.refSquare50 = React.createRef();
    this.refSquare51 = React.createRef();
    this.refSquare52 = React.createRef();
    this.refSquare53 = React.createRef();
    this.refSquare54 = React.createRef();
    this.refSquare55 = React.createRef();
    this.refSquare56 = React.createRef();
    this.refSquare57 = React.createRef();
    this.refSquare58 = React.createRef();
    this.refSquare59 = React.createRef();
    this.refSquare60 = React.createRef();
    this.refSquare61 = React.createRef();
    this.refSquare62 = React.createRef();
    this.refSquare63 = React.createRef();
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
