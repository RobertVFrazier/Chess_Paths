import {
  ADD_MOVE,
  UNDO_MOVE,
  REDO_MOVE,
  INIT_BOARD,
  SET_START,
  SET_END,
  UPDATE_SQUARES
} from "./types";

export const addMove = move => ({
  type: ADD_MOVE,
  move
});

export const undoMove = moves => ({
  type: UNDO_MOVE,
  payload: {
    moves
  }
});

export const redoMove = redo => ({
  type: REDO_MOVE,
  payload: {
    redo
  }
});

export const initBoard = () => ({
  type: INIT_BOARD
});

export const setStart = startPosition => ({
  type: SET_START,
  startPosition
});

export const setEnd = endPosition => ({
  type: SET_END,
  endPosition
});

export const updateSquares = board => ({
  type: UPDATE_SQUARES,
  board
});
