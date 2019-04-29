import {
  INIT_BOARD, // chessboard
  ADD_MOVE,
  SET_POSITIONS,
  HIGHLIGHT_SQUARES,
  UNDO_MOVE, // controls
  REDO_MOVE,
  CLEAR_SQUARES,
  UPDATE_SCOREBOARD,
  RESET_GAME
} from "./types";

// actions for chessboard

export const initBoard = () => ({
  type: INIT_BOARD
});

export const addMove = move => {
  return {
    type: ADD_MOVE,
    move
  };
};

export const setPositions = startPosition => {
  return {
    type: SET_POSITIONS,
    startPosition
  };
};

export const highlightSquares = position => {
  return {
    type: HIGHLIGHT_SQUARES,
    position
  };
};

// actions for controls

export const undoMove = moves => {
  return {
    type: UNDO_MOVE,
    payload: {
      moves
    }
  };
};

export const redoMove = redo => {
  return {
    type: REDO_MOVE,
    payload: {
      redo
    }
  };
};

export const clearSquares = board => {
  return {
    type: CLEAR_SQUARES,
    board
  };
};

export const updateScoreboard = () => {
  return {
    type: UPDATE_SCOREBOARD
  };
};

export const resetGame = () => {
  return {
    type: RESET_GAME
  };
};
