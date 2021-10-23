import React from "react";

export const buildGrid = (payload) => ({
  type: "BUILD_GRID",
  payload: payload,
});

export const GridContext = React.createContext({});

export const gridReducer = (state, action) => {
  switch (action.type) {
    case "BUILD_GRID":
      // console.log('state @ gridReducer.buildGrid: ', state);
      // console.log('action @ gridReducer.buildGrid: ', action);
      state.grid.push(action.payload)
    default:
      return state;
  }
};