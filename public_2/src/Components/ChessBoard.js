import React from "react";
import { connect } from "react-redux";
import queenStanding from "../Images/Queen_Standing.svg";
import {
  initBoard,
  addMove,
  setPositions,
  highlightSquares,
  updateScoreboard
} from "../Actions";
import Square from "./Square";

import { TweenMax, TimelineMax } from "gsap/all";
import soundTileClick from "../Files/tile-click.wav";
import soundBadMove from "../Files/bad-move.wav";
import soundBeamUp from "../Files/beam-up.wav";

export class ChessBoard extends React.Component {
  constructor() {
    super();
    this.queenContainer = null;
    this.audioTileClick = new Audio(soundTileClick);
    this.audioBadMove = new Audio(soundBadMove);
    this.audioBeamUp = new Audio(soundBeamUp);
    this.squarePosition = null;
    this.animationTime = 0.18;
  }
  componentDidMount() {
    this.props.dispatch(initBoard());
  }

  componentDidUpdate(prevProps) {
    /**
     * 1. In here, we compare previous and current props aka,
     * we want to know if current moves length is less then previous one. If so, this means
     * that we clicked undo.
     * 2. Next, we have take the new start and end positions and use them to find the nodes we
     * need and then initiate the animation
     *
     * Undo now works for all move types, and after an undo, the game can continue with new moves.
     */

    let timeline = new TimelineMax();
    let queen = this.queenContainer;
    let colorNew = "";
    let startSquare = document.querySelector(
      `li[value='${prevProps.endPosition}']`
    );
    let endSquare = document.querySelector(
      `li[value='${prevProps.startPosition}']`
    );
    let undoMoveType = "";
    // console.log(prevProps.moves.length, this.props.moves.length);

    if (prevProps.moves.length > 0 && this.props.moves.length === 0) {
      // Reset was clicked.
      if (prevProps.moves.length === 1) {
        this.audioBeamUp.play();
        TweenMax.to(queen, 2, { opacity: 0 });
        colorNew = this.props.board[startSquare.value].black
          ? "rgb(0, 0, 0)"
          : "rgb(245, 245, 238)";
        TweenMax.to(startSquare, 2, {
          backgroundColor: colorNew
        });
      } else {
        let fadeTime = 0.00001;
        TweenMax.to(queen, fadeTime, { opacity: 0 });
        for (let i = 0; i <= 63; i += 1) {
          let squareBeingColored = document.querySelector(`li[value='${i}']`);
          const square = this.props.board[i];
          colorNew = square.black ? "rgb(0, 0, 0)" : "rgb(245, 245, 238)";
          timeline.add(
            TweenMax.to(squareBeingColored, fadeTime, {
              backgroundColor: colorNew
            })
          );
        }
      }
      let squareNumber = 64;
      let tweenX = (squareNumber % 8) * 12.25 + "vw";
      let tweenY = 0 - (8 - Math.floor(squareNumber / 8)) * 12.25 + "vw";
      let duration = 0.001;
      TweenMax.to(queen, duration, {
        x: tweenX,
        y: tweenY,
        display: "block"
      }).delay(2);
      this.squarePosition = null;
    } else if (prevProps.moves.length > this.props.moves.length) {
      // Undo was clicked.
      let { moveType, time } = this.testForLegalMove(
        prevProps.startPosition,
        prevProps.endPosition,
        true, // No need to test for square colors of a diagonal move.
        true // It was legal or it wouldn't be in the array.
      );

      switch (
        moveType // Need to get the opposite direction of the last move.
      ) {
        case "horizRight":
          undoMoveType = "horizLeft";
          break;
        case "horizLeft":
          undoMoveType = "horizRight";
          break;
        case "vertDown":
          undoMoveType = "vertUp";
          break;
        case "vertUp":
          undoMoveType = "vertDown";
          break;
        case "diagDownRight":
          undoMoveType = "diagUpLeft";
          break;
        case "diagDownLeft":
          undoMoveType = "diagUpRight";
          break;
        case "diagUpLeft":
          undoMoveType = "diagDownRight";
          break;
        case "diagUpRight":
          undoMoveType = "diagDownLeft";
          break;
        default:
          undoMoveType = "placePiece";
          break;
      }

      let squareNumber = parseInt(prevProps.startPosition, 10);
      let tweenX = (squareNumber % 8) * 12.25 + "vw";
      let tweenY = 0 - (8 - Math.floor(squareNumber / 8)) * 12.25 + "vw";
      let duration = moveType === "placePiece" ? 0.001 : time;
      TweenMax.to(queen, duration, { x: tweenX, y: tweenY, display: "block" });

      switch (undoMoveType) {
        case "placePiece": // fade out queen, fade out yellow square
          this.audioBeamUp.play();
          TweenMax.to(queen, 2, { opacity: 0 });
          colorNew = this.props.board[startSquare.value].black
            ? "rgb(0, 0, 0)"
            : "rgb(245, 245, 238)";
          TweenMax.to(startSquare, 2, {
            backgroundColor: colorNew
          });
          this.squarePosition = null;
          break;

        case "horizRight":
          this.audioTileClick.play();
          for (let i = startSquare.value; i <= endSquare.value; i += 1) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? "rgb(0, 0, 0)" : "rgb(245, 245, 238)";
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case "horizLeft":
          this.audioTileClick.play();
          for (let i = startSquare.value; i >= endSquare.value; i -= 1) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? "rgb(0, 0, 0)" : "rgb(245, 245, 238)";
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case "vertDown":
          this.audioTileClick.play();
          for (let i = startSquare.value; i <= endSquare.value; i += 8) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? "rgb(0, 0, 0)" : "rgb(245, 245, 238)";
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case "vertUp":
          this.audioTileClick.play();
          for (let i = startSquare.value; i >= endSquare.value; i -= 8) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? "rgb(0, 0, 0)" : "rgb(245, 245, 238)";
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case "diagDownRight":
          this.audioTileClick.play();
          for (let i = startSquare.value; i <= endSquare.value; i += 9) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? "rgb(0, 0, 0)" : "rgb(245, 245, 238)";
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case "diagDownLeft":
          this.audioTileClick.play();
          for (let i = startSquare.value; i <= endSquare.value; i += 7) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? "rgb(0, 0, 0)" : "rgb(245, 245, 238)";
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case "diagUpLeft":
          this.audioTileClick.play();
          for (let i = startSquare.value; i >= endSquare.value; i -= 9) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? "rgb(0, 0, 0)" : "rgb(245, 245, 238)";
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case "diagUpRight":
          this.audioTileClick.play();
          for (let i = startSquare.value; i >= endSquare.value; i -= 7) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? "rgb(0, 0, 0)" : "rgb(245, 245, 238)";
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        default:
          break;
      }
    }
  }

  testForLegalMove(start, end, startColor, endColor) {
    let moveType = "null";
    let moveSquares = 0;
    if (start === null) {
      moveType = "placePiece";
    } else if (end > start && end - start < 8 && end % 8 > start % 8) {
      moveType = "horizRight";
      moveSquares = end - start;
    } else if (start > end && start - end < 8 && start % 8 > end % 8) {
      moveType = "horizLeft";
      moveSquares = start - end;
    } else if (start < end && start % 8 === end % 8) {
      moveType = "vertDown";
      moveSquares =
        Math.floor(parseInt(end, 10) / 8) - Math.floor(parseInt(start, 10) / 8);
    } else if (start > end && start % 8 === end % 8) {
      moveType = "vertUp";
      moveSquares =
        Math.floor(parseInt(start, 10) / 8) - Math.floor(parseInt(end, 10) / 8);
    } else if (
      end > start &&
      (end - start) % 9 === 0 &&
      startColor === endColor
    ) {
      moveType = "diagDownRight";
      moveSquares = (parseInt(end, 10) % 8) - (parseInt(start, 10) % 8);
    } else if (
      end > start &&
      (end - start) % 7 === 0 &&
      startColor === endColor
    ) {
      moveType = "diagDownLeft";
      moveSquares = (parseInt(start, 10) % 8) - (parseInt(end, 10) % 8);
    } else if (
      end < start &&
      (start - end) % 9 === 0 &&
      startColor === endColor
    ) {
      moveType = "diagUpLeft";
      moveSquares = (parseInt(start, 10) % 8) - (parseInt(end, 10) % 8);
    } else if (
      end < start &&
      (start - end) % 7 === 0 &&
      startColor === endColor
    ) {
      moveType = "diagUpRight";
      moveSquares = (parseInt(end, 10) % 8) - (parseInt(start, 10) % 8);
    }
    let squareTime = this.animationTime;
    let time = moveSquares * squareTime;
    return { moveType, time };
  }

  handleSquareClicked = squareNode => {
    var timeline = new TimelineMax();
    const queen = this.queenContainer;
    let end = squareNode.value;
    let { moveType, time } = this.testForLegalMove(
      this.squarePosition,
      end,
      this.squarePosition === null
        ? null
        : this.props.board[this.squarePosition].black,
      this.props.board[end].black
    );

    if (moveType === "null") {
      // illegal moves
      this.audioBadMove.play();
      TweenMax.to(queen, 0.15, { rotation: 6 })
        .repeat(3)
        .yoyo(true);
    } else {
      // legal move
      this.props.dispatch(addMove(squareNode.value));
      this.props.dispatch(setPositions(squareNode.value));
      this.props.dispatch(highlightSquares(squareNode.value));
      this.props.dispatch(updateScoreboard());

      let squareNumber = parseInt(squareNode.value, 10);
      let tweenX = (squareNumber % 8) * 12.25 + "vw";
      let tweenY = 0 - (8 - Math.floor(squareNumber / 8)) * 12.25 + "vw";
      let duration = moveType === "placePiece" ? 0.001 : time;
      let colorNew = "";
      let square = squareNode;
      TweenMax.to(queen, duration, { x: tweenX, y: tweenY, display: "block" });

      switch (moveType) {
        case "placePiece": // fade in queen, fade in yellow square
          this.audioBeamUp.play();
          TweenMax.to(queen, 2, { opacity: 1 });
          colorNew = this.props.board[squareNode.value].black
            ? "rgb(150, 128, 41)"
            : "rgb(245, 223, 136)";
          TweenMax.to(square, 2, {
            backgroundColor: colorNew
          });
          break;

        case "horizRight":
          this.audioTileClick.play();
          for (let i = this.squarePosition + 1; i <= end; i += 1) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black
              ? "rgb(150, 128, 41)"
              : "rgb(245, 223, 136)";
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew
              })
            );
          }
          break;

        case "horizLeft":
          this.audioTileClick.play();
          for (let i = this.squarePosition - 1; i >= end; i -= 1) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black
              ? "rgb(150, 128, 41)"
              : "rgb(245, 223, 136)";
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew
              })
            );
          }
          break;

        case "vertDown":
          this.audioTileClick.play();
          for (let i = this.squarePosition + 8; i <= end; i += 8) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black
              ? "rgb(150, 128, 41)"
              : "rgb(245, 223, 136)";
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew
              })
            );
          }
          break;

        case "vertUp":
          this.audioTileClick.play();
          for (let i = this.squarePosition - 8; i >= end; i -= 8) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black
              ? "rgb(150, 128, 41)"
              : "rgb(245, 223, 136)";
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew
              })
            );
          }
          break;

        case "diagDownRight":
          this.audioTileClick.play();
          for (let i = this.squarePosition + 9; i <= end; i += 9) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black
              ? "rgb(150, 128, 41)"
              : "rgb(245, 223, 136)";
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew
              })
            );
          }
          break;

        case "diagDownLeft":
          this.audioTileClick.play();
          for (let i = this.squarePosition + 7; i <= end; i += 7) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black
              ? "rgb(150, 128, 41)"
              : "rgb(245, 223, 136)";
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew
              })
            );
          }
          break;

        case "diagUpLeft":
          this.audioTileClick.play();
          for (let i = this.squarePosition - 9; i >= end; i -= 9) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black
              ? "rgb(150, 128, 41)"
              : "rgb(245, 223, 136)";
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew
              })
            );
          }
          break;

        case "diagUpRight":
          this.audioTileClick.play();
          for (let i = this.squarePosition - 7; i >= end; i -= 7) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black
              ? "rgb(150, 128, 41)"
              : "rgb(245, 223, 136)";
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew
              })
            );
          }
          break;

        default:
          break;
      }
      timeline.play();
      this.squarePosition = end;
    }
  };
  render() {
    return (
      <div>
        <ul className="board">
          {this.props.board.map(square => (
            <Square
              queenContainer={this.queenContainer}
              handleSquareClicked={this.handleSquareClicked}
              key={square.position}
              ref={this[`refSquare${square.position}`]}
              {...square}
            />
          ))}
        </ul>
        <img
          src={queenStanding}
          alt=""
          className="queen"
          ref={img => (this.queenContainer = img)}
        />
      </div>
    );
  }
}

const mapState = state => {
  return {
    board: state.board,
    startPosition: state.startPosition,
    endPosition: state.endPosition,
    moves: state.moves
  };
};

export default connect(mapState)(ChessBoard);
