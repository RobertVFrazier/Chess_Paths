import React from "react";
import className from "classnames";

import Scoreboard from "./Scoreboard";
import Controls from "./Controls";

export default class Interface extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={className("interface")}>
        <Scoreboard />
        <Controls />
      </div>
    );
  }
}
