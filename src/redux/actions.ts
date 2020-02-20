export enum ActionTypes {
  SET_ITEMS = 0,
  TIC = 1,
  INIT = 2,
  RESET = 3,
  AUTOMOVE = 4
}

export const initGame = () => ({
  type: ActionTypes.INIT,
  payload: {}
});

export const resetScore = () => ({
  type: ActionTypes.RESET,
  payload: {}
});

export const setItems = (items: GameBoardItem[][]) => ({
  type: ActionTypes.SET_ITEMS,
  payload: {
    items
  }
});

export const tic = () => ({
  type: ActionTypes.TIC,
  payload: {}
});

export const automateMove = (numTimes: number) => ({
  type: ActionTypes.AUTOMOVE,
  payload: { numTimes: numTimes }
})

