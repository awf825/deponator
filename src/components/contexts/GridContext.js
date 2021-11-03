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
      const vg = state.grid;
      const newPos = (action.payload.col - 1);
      const idx = state.grid.findIndex(gg => gg['id'] === action.payload.id);
      vg[idx].pos = newPos;

      return {
        ...state,
        grid: vg
      }
    case "CALC_MOTION":
      console.log('[delta, state.grid]: ', action.payload.delta, state.grid)
      return {
        ...state,
        moving: true,
        delta: action.payload.delta
      };
    default:
      return state;
  }
};