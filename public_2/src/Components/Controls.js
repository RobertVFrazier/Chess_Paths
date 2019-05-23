import React from "react";
import { connect } from "react-redux";
import className from "classnames";
import { TweenMax, TimelineMax } from "gsap/all";
import soundTileClick from "../Files/tile-click.wav";
import soundBeamUp from "../Files/beam-up.wav";

import {
  undoMove,
  redoMove,
  clearSquares,
  setPositions,
  highlightSquares,
  updateScoreboard,
  resetGame
} from "../Actions";

function mapStateToProps(state) {
  return {
    moves: state.moves,
    redo: state.redo,
    score: state.score
  };
}

class Controls extends React.Component {
  constructor() {
    super();
    this.audioTileClick = new Audio(soundTileClick);
    this.audioBeamUp = new Audio(soundBeamUp);
  }

  undoMove = () => {
    this.props.dispatch(clearSquares());
    this.props.dispatch(undoMove());
    let colorNew = "";
    const queen = this.props.queenContainer;

    for (let i = 0; i < this.props.moves.length - 1; i += 1) {
      const position = this.props.moves[i];
      this.props.dispatch(setPositions(position));
      this.props.dispatch(highlightSquares(position));
    }
    this.props.dispatch(updateScoreboard());
    this.logs();
    if (this.props.moves.length === 1) {
      this.audioBeamUp.play();
      TweenMax.to(queen, 2, { opacity: 0 });
      // colorNew = this.props.board[this.props.position].black
      //   ? "rgb(0, 0, 0)"
      //   : "rgb(245, 245, 238)";
      // TweenMax.to(square, 2, {
      //   backgroundColor: colorNew
      // });
    }
  };

  resetGame = () => {
    this.props.dispatch(resetGame());
    this.props.dispatch(updateScoreboard());
  };

  redoMove = () => {
    this.props.dispatch(clearSquares());
    this.props.dispatch(redoMove());

    for (let i = 0; i < this.props.moves.length + 1; i += 1) {
      const position = this.props.redo[i];
      this.props.dispatch(setPositions(position));
      this.props.dispatch(highlightSquares(position));
    }
    this.props.dispatch(updateScoreboard());
  };

  logs() {
    console.log(this.props.moves, this.props.redo);
  }

  render() {
    const cannotUndo = !this.props.moves.length;
    const cannotReset = !this.props.moves.length;
    const cannotRedo = this.props.moves.length === this.props.redo.length;

    return (
      <div className={className("controls")}>
        <div>
          <button disabled={cannotUndo} onClick={this.undoMove}>
            Undo
          </button>
          <button disabled={cannotReset} onClick={this.resetGame}>
            Reset
          </button>
          <button disabled={cannotRedo} onClick={this.redoMove}>
            Redo
          </button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Controls);
