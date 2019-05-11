import React from "react";
import className from "classnames";
import { TimelineLite } from "gsap/all";

export default class Square extends React.Component {
  constructor() {
    super();
    this.initialSquareTween = new TimelineLite();
  }

  handleSquareClicked = event => {
    this.props.handleSquareClicked(event.currentTarget.value);
    // console.log(this.props);
    let squareNumber = parseInt(this.props.position, 10);
    let tweenX = (squareNumber % 8) * 12.25 + "vw";
    let tweenY = 0 - (8 - Math.floor(squareNumber / 8)) * 12.25 + "vw";
    console.log(tweenX, tweenY);
    console.log(this.props.movesDone);
    this.initialSquareTween
      .to(this.props.queenContainer, 0.5, {
        x: tweenX,
        y: tweenY,
        display: "block"
      })
      .to(this.props.queenContainer, 1.5, { opacity: 1 });
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
        {this.props.position}&nbsp;&nbsp;&nbsp;&nbsp;
        {parseInt(this.props.position, 10) % 8}&nbsp;&nbsp;&nbsp;&nbsp;
        {Math.floor(parseInt(this.props.position, 10) / 8)}
      </li>
    );
  }
}
