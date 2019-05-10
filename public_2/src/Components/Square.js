import React from "react";
import className from "classnames";
import { TimelineLite, CSSPlugin } from "gsap/all";

export default class Square extends React.Component {
  constructor() {
    super();
    this.queenContainer = null;
    this.queenTween = new TimelineLite({ paused: true });
  }

  componentDidMount() {
    this.queenTween = new TimelineLite({ paused: true })
      .to(this.queenContainer, 1, { y: "-61.25vw", x: "24.5vw" })
      .to(this.queenContainer, 1, { rotation: 360, transformOrigin: "center" });
  }

  handleSquareClicked = event => {
    this.props.handleSquareClicked(event.currentTarget.value);
    // console.log(event.currentTarget.value);
    this.queenTween.to(this.queenContainer, 1, { y: "-61.25vw", x: "24.5vw" });
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
