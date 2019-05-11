import React from "react";
import className from "classnames";
import { TimelineLite } from "gsap/all";

export default class Square extends React.Component {
  constructor() {
    super();
    this.initialSquareTween = new TimelineLite();
    this.x = 0;
    this.y = 0;
    this.tweenX = "";
    this.tweenY = "";
  }

  handleSquareClicked = event => {
    this.props.handleSquareClicked(event.currentTarget.value);
    // console.log(this.props);
    this.x = (parseInt(this.props.position, 10) % 8) * 12.25;
    this.y =
      0 - (8 - Math.floor(parseInt(this.props.position, 10) / 8)) * 12.25;
    this.tweenX = this.x + "vw";
    this.tweenY = this.y + "vw";
    console.log(this.tweenX, this.tweenY);
    this.initialSquareTween
      .to(this.props.queenContainer, 0.5, {
        x: this.tweenX,
        y: this.tweenY,
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
