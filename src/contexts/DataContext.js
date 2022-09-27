import React from "react";

export const setNewData = (payload) => ({
	type: "SET",
	payload: payload
});

export const DataContext = React.createContext({});

export const dataReducer = (state, action) => {
	switch (action.type) {
		case "SET":
            console.log('action.payload: ', action.payload)
            return { ...state, data: action.payload };
		default:
			return state
	}

}