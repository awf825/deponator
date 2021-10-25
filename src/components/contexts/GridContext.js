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
      // console.log('action.payload @ TOG_COL: ', action.payload);
      // console.log('state.grid: ', state.grid)
      const expectedPosition = state.grid.filter(gs => gs[action.payload.id])
      if (expectedPosition !== undefined) {
        if (expectedPosition === action.payload.pos) {
          return true;
        } else {
          // state.grid.forEach(gs=>{
          //   if (gs[action.payload.id]) {
          //       var x = gs[action.payload.id];
          //       return { 
          //         ...state, 
          //         grid: [...state.grid, state.grid[x]: action.payload.pos-1]
          //       }
          //       //gs[action.payload.id] = action.payload.pos-1
          //   }
          // })
        }
        return state
      } else {
        console.log('expectedPosition IS undefined')
      }
      // if (state.grid.length > 0) {
      //   // returns single integer
      //   const expectedPosition = state.grid.filter(gs => gs[action.payload.id])[0][action.payload.id];
      //   if (expectedPosition !== payload.pos) {
      //     console.log('expectedPosition !== payload.pos')
      //   }
      // }
    default:
      return state;
  }
};