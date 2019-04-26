import {
  INIT_BOARD, // chessboard
  ADD_MOVE,
  SET_POSITIONS,
  HIGHLIGHT_SQUARES,
  UNDO_MOVE, // controls
  REDO_MOVE,
  CLEAR_SQUARES,
  REPAINT_SQUARES
} from "../../Actions/types";

const initialState = {
  moves: [],
  redo: [],
  board: [],
  startPosition: null,
  endPosition: null
};

export default function movesReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_BOARD:
      const board = [];
      let evensBlack = false;
      let squareIsBlack = false;
      for (let i = 0; i < 64; i += 1) {
        if (
          (evensBlack === true && i % 2 === 0) ||
          (evensBlack === false && i % 2 !== 0)
        ) {
          squareIsBlack = true;
        } else {
          squareIsBlack = false;
        }
        board.push({
          position: i,
          black: squareIsBlack,
          movedThrough: false
        });
        if ((i + 1) % 8 === 0) {
          evensBlack = !evensBlack;
        }
      }
      return {
        ...state,
        board: [...board]
      };

    case ADD_MOVE:
      return {
        ...state,
        moves: [...state.moves, action.move],
        redo: [...state.moves, action.move]
      };

    case SET_POSITIONS:
      return {
        ...state,
        startPosition:
          state.endPosition === null ? action.startPosition : state.endPosition,
        endPosition: action.startPosition
      };

    case HIGHLIGHT_SQUARES:
      const { position } = action;
      const { startPosition: start, endPosition: end } = state;
      console.log(state);

      if (state.moves.length === 1) {
        console.log("first");
        return {
          ...state,
          board: highlight("placePiece", start, position, state.board)
        };
      } else if (
        position > start &&
        position - start < 8 &&
        position % 8 > start % 8
      ) {
        return {
          ...state,
          board: highlight("horizRight", start, position, state.board)
        };
      } else if (
        start > position &&
        start - position < 8 &&
        start % 8 > position % 8
      ) {
        return {
          ...state,
          board: highlight("horizLeft", start, position, state.board)
        };
      } else if (start < position && start % 8 === position % 8) {
        return {
          ...state,
          board: highlight("vertDown", start, position, state.board)
        };
      } else if (start > position && start % 8 === position % 8) {
        return {
          ...state,
          board: highlight("vertUp", start, position, state.board)
        };
      } else if (position > start && (position - start) % 9 === 0) {
        return {
          ...state,
          board: highlight("diagDownRight", start, position, state.board)
        };
      } else if (position > start && (position - start) % 7 === 0) {
        return {
          ...state,
          board: highlight("diagDownLeft", start, position, state.board)
        };
      } else if (position < start && (start - position) % 9 === 0) {
        return {
          ...state,
          board: highlight("diagUpLeft", start, position, state.board)
        };
      } else if (position < start && (start - position) % 7 === 0) {
        return {
          ...state,
          board: highlight("diagUpRight", start, position, state.board)
        };
      } else {
        return state;
      }

    case UNDO_MOVE:
      if (!state.moves.length) {
        return state;
      } else {
        return {
          ...state,
          moves: state.moves.slice(0, state.moves.length - 1)
        };
      }

    case REDO_MOVE:
      if (state.moves.length === state.redo.length) {
        return state;
      } else {
        return {
          ...state,
          moves: state.redo.slice(0, state.moves.length + 1)
        };
      }

    case CLEAR_SQUARES:
      if (state.board.length === 0) {
        return state;
      } else {
        return {
          ...state,
          board: clearAll(state.board)
        };
      }

    default:
      return state;
  }
}

const paintSquares = moveType => {
  return (
    {
      placePiece: (i, start, position) => i === start && i === position,
      horizRight: (i, start, position) => i >= start && i <= position,
      horizLeft: (i, start, position) => i >= position && i <= start,
      vertDown: (i, start, position) =>
        i >= start && i <= position && i % 8 === start % 8,
      vertUp: (i, start, position) =>
        i <= start && i >= position && i % 8 === start % 8,
      diagDownRight: (i, start, position) =>
        i >= start && i <= position && (i - start) % 9 === 0,
      diagDownLeft: (i, start, position) =>
        i >= start && i <= position && (i - start) % 7 === 0,
      diagUpLeft: (i, start, position) =>
        i <= start && i >= position && (start - i) % 9 === 0,
      diagUpRight: (i, start, position) =>
        i <= start && i >= position && (start - i) % 7 === 0
    }[moveType] || {}
  );
};

const highlight = (moveType, start, position, board) => {
  console.log(moveType, start, position);
  return board.map((square, i) => {
    if (paintSquares(moveType)(i, start, position)) {
      square.movedThrough = true;
    }
    return square;
  });
};

const clearAll = board => {
  return board.map((square, i) => {
    square.movedThrough = false;
    return square;
  });
};
