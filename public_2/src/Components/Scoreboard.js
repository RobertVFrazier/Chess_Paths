import React from "react";
import className from "classnames";

export default class Scoreboard extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <div className={className("scoreboard")}>Scoreboard goes here</div>;
  }
}
