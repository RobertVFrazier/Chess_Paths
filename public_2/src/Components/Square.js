import React from 'react';
import className from 'classnames';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    board: state.board,
    startPosition: state.startPosition,
  };
}

class Square extends React.Component {
  handleSquareClicked = event => {
    this.props.handleSquareClicked(event.currentTarget);
  };

  render() {
    const classname = className(
      'square',
      { 'square--black': this.props.black },
      { 'square--highlighted': this.props.movedThrough }
    );
    return (
      <li onClick={this.handleSquareClicked} value={this.props.position} className={classname}>
        {this.props.position}&nbsp;&nbsp;&nbsp;&nbsp;
        {parseInt(this.props.position, 10) % 8}&nbsp;&nbsp;&nbsp;&nbsp;
        {Math.floor(parseInt(this.props.position, 10) / 8)}
      </li>
    );
  }
}

export default connect(mapStateToProps)(Square);
