import React from "react";
import className from "classnames";
import { connect } from "react-redux";
import { TweenMax } from "gsap/all";

let start = null;

function mapStateToProps(state) {
  return {
    board: state.board,
    startPosition: state.startPosition
  };
}

function testForLegalMove(start, end, startColor, endColor) {
  let moveType = "null";
  let moveSquares = 0;
  if (start === null) {
    moveType = "placePiece";
  } else if (end > start && end - start < 8 && end % 8 > start % 8) {
    moveType = "horizRight";
    moveSquares = end - start;
  } else if (start > end && start - end < 8 && start % 8 > end % 8) {
    moveType = "horizLeft";
    moveSquares = start - end;
  } else if (start < end && start % 8 === end % 8) {
    moveType = "vertDown";
    moveSquares =
      Math.floor(parseInt(end, 10) / 8) - Math.floor(parseInt(start, 10) / 8);
  } else if (start > end && start % 8 === end % 8) {
    moveType = "vertUp";
    moveSquares =
      Math.floor(parseInt(start, 10) / 8) - Math.floor(parseInt(end, 10) / 8);
  } else if (
    end > start &&
    (end - start) % 9 === 0 &&
    startColor === endColor
  ) {
    moveType = "diagDownRight";
    moveSquares = (parseInt(end, 10) % 8) - (parseInt(start, 10) % 8);
  } else if (
    end > start &&
    (end - start) % 7 === 0 &&
    startColor === endColor
  ) {
    moveType = "diagDownLeft";
    moveSquares = (parseInt(start, 10) % 8) - (parseInt(end, 10) % 8);
  } else if (
    end < start &&
    (start - end) % 9 === 0 &&
    startColor === endColor
  ) {
    moveType = "diagUpLeft";
    moveSquares = (parseInt(start, 10) % 8) - (parseInt(end, 10) % 8);
  } else if (
    end < start &&
    (start - end) % 7 === 0 &&
    startColor === endColor
  ) {
    moveType = "diagUpRight";
    moveSquares = (parseInt(end, 10) % 8) - (parseInt(start, 10) % 8);
  }
  let squareTime = 0.15;
  let time = moveSquares * squareTime;
  return { moveType, time };
}

class Square extends React.Component {
  // constructor() {
  //   super();
  //   this.queenTween = new TimelineLite();
  // }

  handleSquareClicked = event => {
    const queen = this.props.queenContainer;
    let end = event.currentTarget.value;
    let { moveType, time } = testForLegalMove(
      start,
      end,
      start === null ? null : this.props.board[start].black,
      this.props.board[end].black
    );
    console.log(
      start,
      end,
      this.props.board[end].black ? "Black" : "White",
      `${moveType}` === "null" ? "ILLEGAL!" : `${moveType}`
    );
    if (`${moveType}` === "null") {
      TweenMax.to(queen, 0.15, { rotation: 6 })
        .repeat(3)
        .yoyo(true);
    } else {
      start = end;
      this.props.handleSquareClicked(event.currentTarget.value);
      // console.log(this.props);
      const squaresDone = this.props.board.filter(tile => tile.movedThrough)
        .length;
      let squareNumber = parseInt(this.props.position, 10);
      let tweenX = (squareNumber % 8) * 12.25 + "vw";
      let tweenY = 0 - (8 - Math.floor(squareNumber / 8)) * 12.25 + "vw";
      let delayTime = squaresDone === 1 ? 0.001 : `${time}`;
      TweenMax.to(queen, delayTime, {
        x: tweenX,
        y: tweenY,
        display: "block" // Where is it documented that this is needed? Why won't the queen appear without it?
      });
      if (squaresDone === 1) {
        TweenMax.to(queen, 1.25, { opacity: 1 });
      }
    }
  };

  render() {
    const classname = className(
      "square",
      { "square--black": this.props.black },
      { "square--highlighted": this.props.movedThrough }
    );
    return (
      <li
        onClick={this.handleSquareClicked}
        value={this.props.position}
        className={classname}
      >
        {/* {this.props.position}&nbsp;&nbsp;&nbsp;&nbsp;
        {parseInt(this.props.position, 10) % 8}&nbsp;&nbsp;&nbsp;&nbsp;
        {Math.floor(parseInt(this.props.position, 10) / 8)} */}
      </li>
    );
  }
}

export default connect(mapStateToProps)(Square);
