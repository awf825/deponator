import React from "react";

export const reconcile = (id, delta, position, gridState) => ({
	type: "RCNCL",
	payload: {
		id: id,
		delta: delta,
		position: position,
		gridState: gridState
	}
});

export const MotionContext = React.createContext({});

export const motionReducer = (state, action) => {
	switch (action.type) {
		case "RCNCL":
			var grid = action.payload.gridState.grid;
			var moving = grid.findIndex(x => (x['id'] === action.payload.id));
			var toMove = grid[moving+action.payload.delta];
			// find position of the id of the res moving
			// use delta to find id of the first res that needs to move
			// set the resources in motion?
			console.log('reconcile action.payload:', action.payload)
			return {
				moving: action.payload.id,
				toMove: toMove['id']
			}
		default:
			return state
	}
}