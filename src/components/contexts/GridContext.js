import React from "react";

export const buildGrid = (payload) => ({
  type: "BUILD_GRID",
  payload: payload,
});

export const changeColumn = (col, pos, id) => ({
  type: "TOG_COL",
  payload: {
    id: id,
    col: col,
    pos: pos,
  } 
})

export const calcMotion = (delta) => ({
  type: "CALC_MOTION",
  payload: {
    delta: delta
  } 
})

export const GridContext = React.createContext({});

export const gridReducer = (state, action) => {
  switch (action.type) {
    case "BUILD_GRID":
      return { 
        ...state, 
        grid: [...state.grid, action.payload]
      };
      // state.grid.push(action.payload)
    case "TOG_COL":
      // I NEED TO CHANGE POSITION OF RESOURCE BY ID TO COL - 1 (FOR NOW, SINCE I ONLY HAVE 3 CELLS)
      const newPosition = (action.payload.col - 1);
      // find the resource I'm moving, then change the position to the column I've moved to
      const newGrid = state.grid.map(gg => 
        gg[action.payload.id]
        ? {...gg, [action.payload.id]: newPosition }
        : gg
      )
      // update state/context so other resources can see
      return {
        ...state,
        grid: newGrid
      }
    case "CALC_MOTION":
      console.log('[delta, state.grid]: ', action.payload.delta, state.grid)
      return state;
    default:
      return state;
  }
};