import {
  ADD_MOVE,
  UNDO_MOVE,
  REDO_MOVE,
  INIT_BOARD,
  SET_START,
  SET_END,
} from '../../Actions/types';

const initialState = {
  moves: [],
  redo: [],
  board: [],
  startPosition: null,
  endPosition: null,
};

const paintSquares = moveType => {
  return (
    {
      placePiece: (i, start, end) => i === end && !start,
      horizRight: (i, start, end) => i >= start && i <= end,
      horizLeft: (i, start, end) => i >= end && i <= start,
      vertDown: (i, start, end) => i >= start && i <= end && i % 8 === start % 8,
      vertUp: (i, start, end) => i <= start && i >= end && i % 8 === start % 8,
      diagDownRight: (i, start, end) => i >= start && i <= end && (i - start) % 9 === 0,
      diagDownLeft: (i, start, end) => i >= start && i <= end && (i - start) % 7 === 0,
      diagUpLeft: (i, start, end) => i <= start && i >= end && (start - i) % 9 === 0,
      diagUpRight: (i, start, end) => i <= start && i >= end && (start - i) % 7 === 0,
    }[moveType] || {}
  );
};

const highlight = (moveType, position, end, board) => {
  return board.map((square, i) => {
    if (paintSquares(moveType)(i, end, position)) {
      square.movedThrough = true;
    }
    return square;
  });
};

export default function movesReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_BOARD:
      const board = [];
      let evensBlack = false;
      let squareIsBlack = false;
      for (let i = 0; i < 64; i += 1) {
        if ((evensBlack === true && i % 2 === 0) || (evensBlack === false && i % 2 !== 0)) {
          squareIsBlack = true;
        } else {
          squareIsBlack = false;
        }
        board.push({
          position: i,
          black: squareIsBlack,
          movedThrough: false,
        });
        if ((i + 1) % 8 === 0) {
          evensBlack = !evensBlack;
        }
      }
      return {
        ...state,
        board: [...board],
      };

    case ADD_MOVE:
      return {
        ...state,
        moves: [...state.moves, action.move],
        redo: [...state.moves, action.move],
      };

    case UNDO_MOVE:
      if (!state.moves.length) {
        return state;
      } else {
        return {
          ...state,
          moves: state.moves.slice(0, state.moves.length - 1),
        };
      }

    case REDO_MOVE:
      if (state.moves.length === state.redo.length) {
        return state;
      } else {
        return {
          ...state,
          moves: state.redo.slice(0, state.moves.length + 1),
        };
      }

    case 'SET_POSITIONS':
      return {
        ...state,
        startPosition: state.endPosition === null ? action.startPosition : state.endPosition,
        endPosition: action.startPosition,
      };

    case 'HIGHLIGHT':
      const { position } = action;
      const { startPosition: start, endPosition: end } = state;

      if (state.moves.length === 1) {
        return { ...state, board: highlight('placePiece', position, end, state.board) };
      } else if (position > start && position - start < 8 && position % 8 > start % 8) {
        return { ...state, board: highlight('horizRight', position, end, state.board) };
      } else if (start > position && start - position < 8 && start % 8 > position % 8) {
        return { ...state, board: highlight('horizLeft', position, end, state.board) };
      } else if (start < position && start % 8 === position % 8) {
        return { ...state, board: highlight('vertDown', position, end, state.board) };
      } else if (start > position && start % 8 === position % 8) {
        return { ...state, board: highlight('vertUp', position, end, state.board) };
      } else if (position > start && (position - start) % 9 === 0) {
        return { ...state, board: highlight('diagDownRight', position, end, state.board) };
      } else if (position > start && (position - start) % 7 === 0) {
        return { ...state, board: highlight('diagDownLeft', position, end, state.board) };
      } else if (position < start && (start - position) % 9 === 0) {
        return { ...state, board: highlight('diagUpLeft', position, end, state.board) };
      } else if (position < start && (start - position) % 7 === 0) {
        return { ...state, board: highlight('diagUpRight', position, end, state.board) };
      } else {
        return state;
      }

    default:
      return state;
  }
}
