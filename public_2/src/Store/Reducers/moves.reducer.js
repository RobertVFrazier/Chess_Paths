import {
  ADD_MOVE,
  UNDO_MOVE,
  REDO_MOVE,
  INIT_BOARD,
  SET_START,
  SET_END,
  UPDATE_SQUARES,
} from '../../Actions/types';

const initialState = {
  moves: [],
  redo: [],
  board: [],
  current: null,
  startPosition: null,
  endPosition: null,
};

export default function movesReducer(state = initialState, action) {
  switch (action.type) {
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
    case SET_START:
      return {
        ...state,
        startPosition: action.startPosition,
      };
    case SET_END:
      return {
        ...state,
        endPosition: action.endPosition,
      };
    case UPDATE_SQUARES:
      return {
        ...state,
        board: [...action.board],
      };

    case 'SET_ALL':
      const moves = [...state.moves];

      if (state.moves.indexOf(action.move) === -1) {
        moves.push(action.move);
      }

      return {
        ...state,
        endPosition: action.endPosition,
        startPosition: action.startPosition,
        moves: [...moves],
        redo: [...moves],
        board: [...action.board],
      };

    case 'SET_CURRENT_POSITION':
      return {
        ...state,
        current: action.current,
      };

    default:
      return state;
  }
}
