import React from 'react';
import { connect } from 'react-redux';
import className from 'classnames';

import { undoMove, redoMove } from '../Actions';

function mapStateToProps(state) {
  return {
    moves: state.moves,
  };
}

class Controls extends React.Component {
  undoMove = () => {
    this.props.dispatch(undoMove());
  };

  redoMove = () => {
    this.props.dispatch(redoMove());
  };

  render() {
    return (
      <div className={className('controls')}>
        <div>
          <button onClick={this.undoMove}>Undo</button>
          <button onClick={this.redoMove}>Redo</button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Controls);
