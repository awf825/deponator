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
			//console.log("RCNCL")
			var grid = action.payload.gridState.grid;
			var d = action.payload.delta;
			var p = action.payload.position;
			var id = action.payload.id;
			//debugger
			// gather the item in the grid that meets the conditions:
			// it matches the position of the square I'm moving into (position + (1 or -1))
			// it is not the item I am currently moving 
			var toMove = grid.find(x => (
					(x['pos'] === p+d)
					&&
					(x['id'] !== id)
				)
			)
			//console.log('toMove at reconcile: ', toMove)

			//console.log('action.payload at reconcile: ', action.payload)			//debugger
			var motionArray = [
				{
					'id': action.payload.id,
					'pos': action.payload.position,
					'new': action.payload.position+d
				},
				{
					'id': toMove && toMove['id'],
					'pos': toMove && toMove['pos'],
					'new': toMove && toMove['pos']-d
				}
			]
			return {
				movingList: motionArray
			}
		default:
			return state
	}
}