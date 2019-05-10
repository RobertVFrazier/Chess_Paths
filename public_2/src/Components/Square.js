import React from "react";
import className from "classnames";
import { TimelineLite } from "gsap/all";

export default class Square extends React.Component {
  constructor() {
    super();
    this.queenTween = new TimelineLite({ paused: true });
  }

  handleSquareClicked = event => {
    this.props.handleSquareClicked(event.currentTarget.value);
    console.log(this.props);
    this.queenTween.from(this.props.queenContainer, 1, {
      x: "24.5vw",
      y: "-61.25vw",
      display: "block"
    });
    // .to(this.props.queenContainer, 2, { x: "14.5vw", display: "block" });
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
