import React from "react";
import className from "classnames";

export default class Square extends React.Component {
  handleSquareClicked = event => {
    this.props.handleSquareClicked(event.currentTarget.value);
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
        {this.props.position}
      </li>
    );
  }
}
