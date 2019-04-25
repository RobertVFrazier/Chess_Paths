import React from 'react';
import { connect } from 'react-redux';

import { initBoard, setPositions, setCurrentPosition, highlightSquares } from '../Actions';
import Square from './Square';

export class ChessBoard extends React.Component {
  componentDidMount() {
    this.props.dispatch(initBoard());
  }

  // Investigate using getDerivedStateFromProps()
  // instead of componentWillReceiveProps().

  componentWillReceiveProps(nextProps) {
    // if (this.props.startPosition !== nextProps.current) {
    //   this.paint(nextProps.current, nextProps.startPosition);
    // }
  }

  // updateMove(position) {
  //   this.props.dispatch(
  //     setAll(
  //       this.props.startPosition === null ? position : this.props.endPosition,
  //       position,
  //       position
  //     )
  //   );
  //   this.props.dispatch(highlightSquares(position));
  // }

  handleSquareClicked = position => {
    // Here we will call update move
    this.props.dispatch(setPositions(position));
    this.props.dispatch(highlightSquares(position));
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
    board: state.board,
  };
};

export default connect(mapState)(ChessBoard);
