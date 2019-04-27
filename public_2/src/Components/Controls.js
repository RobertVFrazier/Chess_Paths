import React from 'react';
import { connect } from 'react-redux';
import className from 'classnames';

import {
  undoMove,
  redoMove,
  clearSquares,
  setPositions,
  highlightSquares,
  countHighlighted,
} from '../Actions';

function mapStateToProps(state) {
  return {
    moves: state.moves,
    redo: state.redo,
    score: state.score,
  };
}

class Controls extends React.Component {
  undoMove = () => {
    this.props.dispatch(clearSquares());
    this.props.dispatch(undoMove());

    for (let i = 0; i < this.props.moves.length - 1; i += 1) {
      const position = this.props.moves[i];
      this.props.dispatch(setPositions(position));
      this.props.dispatch(highlightSquares(position));
      this.props.dispatch(countHighlighted());
    }
  };

  redoMove = () => {
    this.props.dispatch(redoMove());
    this.props.dispatch(clearSquares());

    for (let i = 0; i < this.props.moves.length + 1; i += 1) {
      const position = this.props.redo[i];
      this.props.dispatch(setPositions(position));
      this.props.dispatch(highlightSquares(position));
      this.props.dispatch(countHighlighted());
    }
  };

  logs() {
    console.log(this.props.moves, this.props.redo);
  }

  render() {
    const cannotUndo = !this.props.moves.length;
    const cannotRedo = this.props.moves.length === this.props.redo.length;

    return (
      <div className={className('controls')}>
        <div>
          <button disabled={cannotUndo} onClick={this.undoMove}>
            Undo
          </button>
          <button disabled={cannotRedo} onClick={this.redoMove}>
            Redo
          </button>

          <h1>{this.props.score}</h1>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Controls);
