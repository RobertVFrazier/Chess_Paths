import {
  ADD_MOVE,
  UNDO_MOVE,
  REDO_MOVE,
  INIT_BOARD,
  SET_START,
  SET_END,
  UPDATE_SQUARES,
} from './types';

export const addMove = move => {
  return {
    type: ADD_MOVE,
    move,
  };
};

export const undoMove = moves => {
  return {
    type: UNDO_MOVE,
    payload: {
      moves,
    },
  };
};

export const redoMove = redo => {
  return {
    type: REDO_MOVE,
    payload: {
      redo,
    },
  };
};

export const initBoard = () => ({
  type: INIT_BOARD,
});

export const setPositions = startPosition => {
  return {
    type: 'SET_POSITIONS',
    startPosition,
  };
};

export const setEnd = endPosition => {
  return {
    type: SET_END,
    endPosition,
  };
};

export const updateSquares = board => {
  return {
    type: UPDATE_SQUARES,
    board,
  };
};

export const highlightSquares = position => {
  return {
    type: 'HIGHLIGHT',
    position,
  };
};
