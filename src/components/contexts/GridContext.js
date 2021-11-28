import React from "react";

export const buildGrid = (payload) => ({
  type: "BUILD_GRID",
  payload: payload,
});

export const toggleView = (newView, event) => ({
  type: "TOG_VIEW",
  payload: {
    newView: newView,
    event: event
  }
})

export const changeColumn = (col, pos, id) => ({
  type: "TOG_COL",
  payload: {
    id: id,
    col: col,
    pos: pos,
  } 
})

export const togglePassive = (newPos, id) => ({
  type: 'PSV',
  payload: {
    id: id,
    newPos: newPos
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
    case "TOG_VIEW":
      // debugger
      return {
        ...state,
        whichView: action.payload.newView
      }
    case "TOG_COL":
      //console.log('TOG_COL');
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
      const vg2 = state.grid;
      const idx2 = state.grid.findIndex(gg => gg['id'] === action.payload.id);
      vg2[idx2].pos = action.payload.newPos;

      return {
        ...state,
        grid: vg2
      }
    default:
      return state;
  }
};