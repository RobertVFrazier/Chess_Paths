import React from "react";
import { connect } from "react-redux";
import className from "classnames";

function mapStateToProps(state) {
  return {
    movesDone: state.movesDone,
    squaresDone: state.squaresDone,
    movesTodo: state.movesTodo,
    squaresTodo: state.squaresTodo
  };
}

class Scoreboard extends React.Component {
  render() {
    return (
      <div className={className("scoreboard")}>
        <h1>
          Moves Done: {this.props.movesDone} Squares Done:{" "}
          {this.props.squaresDone} Moves To Do: {this.props.movesTodo} Squares
          To Do: {this.props.squaresTodo}
        </h1>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Scoreboard);
