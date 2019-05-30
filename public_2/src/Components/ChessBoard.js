import React from 'react';
import { connect } from 'react-redux';
import queenStanding from '../Images/Queen_Standing.svg';
import queenMovingRight from '../Images/Queen_Moving_Right.svg';
import queenMovingLeft from '../Images/Queen_Moving_Left.svg';
import queenMovingUp from '../Images/Queen_Moving_Up.svg';
import queenMovingDown from '../Images/Queen_Moving_Down.svg';
import queenMovingDiagonalUpLeft from '../Images/Queen_Moving_Diagonal_Up_Left.svg';
import queenMovingDiagonalUpRight from '../Images/Queen_Moving_Diagonal_Up_Right.svg';
import queenMovingDiagonalDownLeft from '../Images/Queen_Moving_Diagonal_Down_Left.svg';
import queenMovingDiagonalDownRight from '../Images/Queen_Moving_Diagonal_Down_Right.svg';
import { initBoard, addMove, setPositions, highlightSquares, updateScoreboard } from '../Actions';
import Square from './Square';

import { TweenMax, TimelineMax } from 'gsap/all';
import soundTileClick from '../Files/tile-click.wav';
import soundBadMove from '../Files/bad-move.wav';
import soundBeamUp from '../Files/beam-up.wav';

export class ChessBoard extends React.Component {
  constructor() {
    super();
    this.queenContainer = null;
    this.audioTileClick = new Audio(soundTileClick);
    this.audioBadMove = new Audio(soundBadMove);
    this.audioBeamUp = new Audio(soundBeamUp);
    this.squarePosition = null;
    this.animationTime = 0.18;
    this.state = {
      queenImage: queenStanding,
    };
  }
  componentDidMount() {
    this.props.dispatch(initBoard());
  }

  componentDidUpdate(prevProps) {
    // console.log(prevProps.moves.length, this.props.moves.length);
    // Only want to handle clicking on Undo, Redo, and Reset in this block of code.
    if (
      this.props.lastAction !== 'UNDO_MOVE' &&
      this.props.lastAction !== 'REDO_MOVE' &&
      this.props.lastAction !== 'RESET_GAME'
    ) {
      return;
    }
    // console.log(`Component just updated: ${this.props.lastAction}`);

    let timeline = new TimelineMax();
    let queen = this.queenContainer;
    let colorNew = '';
    let startSquare = document.querySelector(`li[value='${prevProps.endPosition}']`);
    let endSquare = document.querySelector(`li[value='${prevProps.startPosition}']`);
    let undoMoveType = '';

    if (this.props.lastAction === 'RESET_GAME') {
      // Reset was clicked.
      let duration = 0.001;
      timeline.to(queen, duration, { opacity: 0 });
      for (let i = 0; i <= 63; i += 1) {
        let squareBeingColored = document.querySelector(`li[value='${i}']`);
        const square = this.props.board[i];
        colorNew = square.black ? 'rgb(0, 0, 0)' : 'rgb(245, 245, 238)';
        timeline.to(squareBeingColored, duration, {
          backgroundColor: colorNew,
        });
      }
      timeline.to(queen, duration, { x: '0vw', y: '0vw' });

      this.squarePosition = null;
    } else if (this.props.lastAction === 'UNDO_MOVE') {
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
        case 'horizRight':
          undoMoveType = 'horizLeft';
          break;
        case 'horizLeft':
          undoMoveType = 'horizRight';
          break;
        case 'vertDown':
          undoMoveType = 'vertUp';
          break;
        case 'vertUp':
          undoMoveType = 'vertDown';
          break;
        case 'diagDownRight':
          undoMoveType = 'diagUpLeft';
          break;
        case 'diagDownLeft':
          undoMoveType = 'diagUpRight';
          break;
        case 'diagUpLeft':
          undoMoveType = 'diagDownRight';
          break;
        case 'diagUpRight':
          undoMoveType = 'diagDownLeft';
          break;
        default:
          undoMoveType = 'placePiece';
          break;
      }

      let squareNumber = parseInt(prevProps.startPosition, 10);
      let tweenX = (squareNumber % 8) * 12.25 + 'vw';
      let tweenY = 0 - (8 - Math.floor(squareNumber / 8)) * 12.25 + 'vw';
      let duration = moveType === 'placePiece' ? 0.001 : time;
      TweenMax.to(queen, duration, { x: tweenX, y: tweenY, display: 'block' });

      switch (undoMoveType) {
        case 'placePiece': // fade out queen, fade out yellow square
          this.audioBeamUp.play();
          colorNew = this.props.board[startSquare.value].black
            ? 'rgb(0, 0, 0)'
            : 'rgb(245, 245, 238)';
          timeline
            .to(queen, 2, { opacity: 0 })
            .to(
              startSquare,
              1,
              {
                backgroundColor: colorNew,
              },
              '-=1'
            )
            .to(queen, duration, { x: '0vw', y: '0vw' });
          this.squarePosition = null;
          break;

        case 'horizRight':
          this.setState({ queenImage: queenMovingRight });
          this.audioTileClick.play();
          for (let i = startSquare.value; i <= endSquare.value; i += 1) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? 'rgb(0, 0, 0)' : 'rgb(245, 245, 238)';
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew,
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case 'horizLeft':
          this.setState({ queenImage: queenMovingLeft });
          this.audioTileClick.play();
          for (let i = startSquare.value; i >= endSquare.value; i -= 1) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? 'rgb(0, 0, 0)' : 'rgb(245, 245, 238)';
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew,
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case 'vertDown':
          this.setState({ queenImage: queenMovingDown });
          this.audioTileClick.play();
          for (let i = startSquare.value; i <= endSquare.value; i += 8) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? 'rgb(0, 0, 0)' : 'rgb(245, 245, 238)';
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew,
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case 'vertUp':
          this.setState({ queenImage: queenMovingUp });
          this.audioTileClick.play();
          for (let i = startSquare.value; i >= endSquare.value; i -= 8) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? 'rgb(0, 0, 0)' : 'rgb(245, 245, 238)';
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew,
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case 'diagDownRight':
          this.setState({ queenImage: queenMovingDiagonalDownRight });

          this.audioTileClick.play();
          for (let i = startSquare.value; i <= endSquare.value; i += 9) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? 'rgb(0, 0, 0)' : 'rgb(245, 245, 238)';
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew,
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case 'diagDownLeft':
          this.setState({ queenImage: queenMovingDiagonalDownLeft });

          this.audioTileClick.play();
          for (let i = startSquare.value; i <= endSquare.value; i += 7) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? 'rgb(0, 0, 0)' : 'rgb(245, 245, 238)';
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew,
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case 'diagUpLeft':
          this.setState({ queenImage: queenMovingDiagonalUpLeft });

          this.audioTileClick.play();
          for (let i = startSquare.value; i >= endSquare.value; i -= 9) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? 'rgb(0, 0, 0)' : 'rgb(245, 245, 238)';
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew,
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        case 'diagUpRight':
          this.setState({ queenImage: queenMovingDiagonalUpRight });

          this.audioTileClick.play();
          for (let i = startSquare.value; i >= endSquare.value; i -= 7) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            const square = this.props.board[i];
            colorNew = square.black ? 'rgb(0, 0, 0)' : 'rgb(245, 245, 238)';
            if (!square.movedThrough) {
              timeline.add(
                TweenMax.to(squareBeingColored, this.animationTime, {
                  backgroundColor: colorNew,
                })
              );
            }
          }
          this.squarePosition = endSquare.value;
          break;

        default:
          break;
      }
    } else if (this.props.lastAction === 'REDO_MOVE') {
      // console.log(
      //   `Moves array: ${this.props.moves} Redo array: ${this.props.redo}`
      // );
      // startSquare needs to be the second-to-last element in moves array,
      // endSquare needs to be the last element in moves array.
      // If only one element in moves array, startSquare needs to be null.
      startSquare = document.querySelector(
        `li[value='${this.props.moves[this.props.moves.length - 2]}']`
      );
      endSquare = document.querySelector(
        `li[value='${this.props.moves[this.props.moves.length - 1]}']`
      );
      if (this.props.moves.length === 1) {
        startSquare = null;
      }
      let start = startSquare ? startSquare.value : null;
      let end = endSquare.value;
      // console.log(`Redoing move: ${start} - ${end}`);
      // When redoing, all moves are legal moves.
      // But we still need to know what kind of move,
      // and how many squares covered, to time the animation.
      let { moveType, time } = this.testForLegalMove(start, end, true, true);
      let squareNumber = parseInt(endSquare.value, 10);
      let tweenX = (squareNumber % 8) * 12.25 + 'vw';
      let tweenY = 0 - (8 - Math.floor(squareNumber / 8)) * 12.25 + 'vw';
      let duration = moveType === 'placePiece' ? 0.001 : time;
      let colorNew = '';
      let square = endSquare;
      TweenMax.to(queen, duration, {
        x: tweenX,
        y: tweenY,
        display: 'block',
      });

      switch (moveType) {
        case 'placePiece': // fade in queen, fade in yellow square
          this.audioBeamUp.play();
          TweenMax.to(queen, 2, { opacity: 1 });
          colorNew = this.props.board[endSquare.value].black
            ? 'rgb(150, 128, 41)'
            : 'rgb(245, 223, 136)';
          TweenMax.to(square, 2, {
            backgroundColor: colorNew,
          });
          break;

        case 'horizRight':
          this.setState({ queenImage: queenMovingRight });

          this.audioTileClick.play();
          for (let i = start + 1; i <= end; i += 1) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        case 'horizLeft':
          this.setState({ queenImage: queenMovingLeft });
          this.audioTileClick.play();
          for (let i = start - 1; i >= end; i -= 1) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        case 'vertDown':
          this.setState({ queenImage: queenMovingDown });

          this.audioTileClick.play();
          for (let i = start + 8; i <= end; i += 8) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        case 'vertUp':
          this.setState({ queenImage: queenMovingUp });

          this.audioTileClick.play();
          for (let i = start - 8; i >= end; i -= 8) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        case 'diagDownRight':
          this.setState({ queenImage: queenMovingDiagonalDownRight });

          this.audioTileClick.play();
          for (let i = start + 9; i <= end; i += 9) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        case 'diagDownLeft':
          this.setState({ queenImage: queenMovingDiagonalDownLeft });

          this.audioTileClick.play();
          for (let i = start + 7; i <= end; i += 7) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        case 'diagUpLeft':
          this.setState({ queenImage: queenMovingDiagonalUpLeft });

          this.audioTileClick.play();
          for (let i = start - 9; i >= end; i -= 9) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        case 'diagUpRight':
          this.setState({ queenImage: queenMovingDiagonalUpRight });

          this.audioTileClick.play();
          for (let i = start - 7; i >= end; i -= 7) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        default:
          break;
      }
    }
  }

  testForLegalMove(start, end, startColor, endColor) {
    let moveType = 'null';
    let moveSquares = 0;
    if (start === null) {
      moveType = 'placePiece';
    } else if (end > start && end - start < 8 && end % 8 > start % 8) {
      moveType = 'horizRight';
      moveSquares = end - start;
    } else if (start > end && start - end < 8 && start % 8 > end % 8) {
      moveType = 'horizLeft';
      moveSquares = start - end;
    } else if (start < end && start % 8 === end % 8) {
      moveType = 'vertDown';
      moveSquares = Math.floor(parseInt(end, 10) / 8) - Math.floor(parseInt(start, 10) / 8);
    } else if (start > end && start % 8 === end % 8) {
      moveType = 'vertUp';
      moveSquares = Math.floor(parseInt(start, 10) / 8) - Math.floor(parseInt(end, 10) / 8);
    } else if (end > start && (end - start) % 9 === 0 && startColor === endColor) {
      moveType = 'diagDownRight';
      moveSquares = (parseInt(end, 10) % 8) - (parseInt(start, 10) % 8);
    } else if (end > start && (end - start) % 7 === 0 && startColor === endColor) {
      moveType = 'diagDownLeft';
      moveSquares = (parseInt(start, 10) % 8) - (parseInt(end, 10) % 8);
    } else if (end < start && (start - end) % 9 === 0 && startColor === endColor) {
      moveType = 'diagUpLeft';
      moveSquares = (parseInt(start, 10) % 8) - (parseInt(end, 10) % 8);
    } else if (end < start && (start - end) % 7 === 0 && startColor === endColor) {
      moveType = 'diagUpRight';
      moveSquares = (parseInt(end, 10) % 8) - (parseInt(start, 10) % 8);
    }
    let squareTime = this.animationTime;
    let time = moveSquares * squareTime;
    return { moveType, time };
  }

  standQueenUp() {
    this.queenImage = queenStanding;
  }

  handleSquareClicked = squareNode => {
    var timeline = new TimelineMax();
    const queen = this.queenContainer;
    let end = squareNode.value;
    let { moveType, time } = this.testForLegalMove(
      this.squarePosition,
      end,
      this.squarePosition === null ? null : this.props.board[this.squarePosition].black,
      this.props.board[end].black
    );
    // console.log(this.props.lastAction, moveType);

    if (moveType === 'null') {
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
      let tweenX = (squareNumber % 8) * 12.25 + 'vw';
      let tweenY = 0 - (8 - Math.floor(squareNumber / 8)) * 12.25 + 'vw';
      let duration = moveType === 'placePiece' ? 0.001 : time;
      let colorNew = '';
      let square = squareNode;
      TweenMax.to(queen, duration, { x: tweenX, y: tweenY, display: 'block' });

      switch (moveType) {
        case 'placePiece': // fade in queen, fade in yellow square
          this.audioBeamUp.play();
          colorNew = this.props.board[squareNode.value].black
            ? 'rgb(150, 128, 41)'
            : 'rgb(245, 223, 136)';
          timeline.to(queen, 2, { opacity: 1 }).to(
            square,
            1,
            {
              backgroundColor: colorNew,
            },
            '-=1'
          );
          break;

        case 'horizRight':
          this.setState({ queenImage: queenMovingRight });

          this.audioTileClick.play();
          for (let i = this.squarePosition + 1; i <= end; i += 1) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }

          break;

        case 'horizLeft':
          this.setState({ queenImage: queenMovingLeft });
          this.audioTileClick.play();
          for (let i = this.squarePosition - 1; i >= end; i -= 1) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        case 'vertDown':
          this.setState({ queenImage: queenMovingDown });

          this.audioTileClick.play();
          for (let i = this.squarePosition + 8; i <= end; i += 8) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        case 'vertUp':
          this.setState({ queenImage: queenMovingUp });

          this.audioTileClick.play();
          for (let i = this.squarePosition - 8; i >= end; i -= 8) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        case 'diagDownRight':
          this.setState({ queenImage: queenMovingDiagonalDownRight });

          this.audioTileClick.play();
          for (let i = this.squarePosition + 9; i <= end; i += 9) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        case 'diagDownLeft':
          this.setState({ queenImage: queenMovingDiagonalDownLeft });

          this.audioTileClick.play();
          for (let i = this.squarePosition + 7; i <= end; i += 7) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        case 'diagUpLeft':
          this.setState({ queenImage: queenMovingDiagonalUpLeft });

          this.audioTileClick.play();
          for (let i = this.squarePosition - 9; i >= end; i -= 9) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        case 'diagUpRight':
          this.setState({ queenImage: queenMovingDiagonalUpRight });

          this.audioTileClick.play();
          for (let i = this.squarePosition - 7; i >= end; i -= 7) {
            let squareBeingColored = document.querySelector(`li[value='${i}']`);
            square = this.props.board[i];
            colorNew = square.black ? 'rgb(150, 128, 41)' : 'rgb(245, 223, 136)';
            timeline.add(
              TweenMax.to(squareBeingColored, this.animationTime, {
                backgroundColor: colorNew,
              })
            );
          }
          break;

        default:
          break;
      }

      timeline.play();
      this.squarePosition = end;

      setTimeout(() => {
        this.setState({ queenImage: queenStanding });
      }, time * 1000);
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
          src={this.state.queenImage}
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
    moves: state.moves,
    redo: state.redo,
    lastAction: state.lastAction,
  };
};

export default connect(mapState)(ChessBoard);
