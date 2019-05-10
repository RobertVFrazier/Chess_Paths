import { Component } from "react";
import { TimelineLite } from "gsap/all";
// import className from "classnames";
// import queenStanding from "../Images/Queen_Standing.svg";

class QueenTween extends Component {
  constructor(props) {
    super(props);
    this.queenContainer = null;
    this.queenTween = null;
  }

  componentDidMount() {
    this.queenTween = new TimelineLite({ paused: true });
    //   .to(this.queenContainer, 1, { y: "-61.25vw", x: "24.5vw" })
    //   .to(this.queenContainer, 1, { rotation: 360, transformOrigin: "center" });
  }

  render() {
    return null;
    // return (
    //   <div>
    //     <img
    //       //   src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/logo-man.svg"
    //       src={queenStanding}
    //       alt=""
    //       className="queen"
    //       ref={img => (this.queenContainer = img)}
    //     />
    //     <br />
    //     <button className="gsap-btn" onClick={() => this.queenTween.play()}>
    //       Play
    //     </button>
    //     <button className="gsap-btn" onClick={() => this.queenTween.pause()}>
    //       Pause
    //     </button>
    //     <button className="gsap-btn" onClick={() => this.queenTween.reverse()}>
    //       Reverse
    //     </button>
    //     <button className="gsap-btn" onClick={() => this.queenTween.restart()}>
    //       Restart
    //     </button>
    //   </div>
    // );
  }
}

export default QueenTween;
