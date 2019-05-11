import { Component } from "react";
import { TimelineLite } from "gsap/all";

class QueenTween extends Component {
  constructor(props) {
    super(props);
    this.queenContainer = null;
    this.queenTween = null;
  }

  componentDidMount() {
    this.queenTween = new TimelineLite({ paused: true });
  }

  render() {
    return null;
  }
}

export default QueenTween;
