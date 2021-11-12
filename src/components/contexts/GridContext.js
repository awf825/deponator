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

export const togglePassive = () => ({
  type: 'PSV',
  payload: {}
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
    case "PSV":
      console.log('are we there yet?')
    default:
      return state;
  }
};