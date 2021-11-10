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
			var idxOfMoving = grid.findIndex(x => (x['id'] === action.payload.id));
			var toMove = grid[idxOfMoving+action.payload.delta];
			//debugger
			var motionArray = [
				{
					'id': action.payload.id,
					'pos': action.payload.position
				},
				{
					'id': toMove['id'],
					'pos': toMove['pos']
				}
			]
			return {
				movingList: motionArray
			}
		default:
			return state
	}
}