import React from "react";
import className from "classnames";
import { connect } from "react-redux";
import { TimelineLite } from "gsap/all";

function mapStateToProps(state) {
  return {
    board: state.board
  };
}

class Square extends React.Component {
  constructor() {
    super();
    this.initialSquareTween = new TimelineLite();
  }

  handleSquareClicked = event => {
    this.props.handleSquareClicked(event.currentTarget.value);
    // console.log(this.props);
    const squaresDone = this.props.board.filter(tile => tile.movedThrough)
      .length;
    let squareNumber = parseInt(this.props.position, 10);
    let tweenX = (squareNumber % 8) * 12.25 + "vw";
    let tweenY = 0 - (8 - Math.floor(squareNumber / 8)) * 12.25 + "vw";
    let delayTime = squaresDone === 1 ? 0.001 : 0.5;
    // console.log(tweenX, tweenY);
    this.initialSquareTween
      .to(this.props.queenContainer, delayTime, {
        x: tweenX,
        y: tweenY,
        display: "block" // Where is it documented that this is needed? Why won't the queen appear without it?
      })
      .to(this.props.queenContainer, 1.25, { opacity: 1 });
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
