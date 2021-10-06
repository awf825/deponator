import { Board } from 'react-native-draganddrop-board'
import { BoardRepository } from 'react-native-draganddrop-board'
import React from 'react'
 
const data = [
  {
    id: 1,
    name: 'TO DO',
    rows: [
      {
        id: '1',
        name: 'Analyze your audience',
        description: 'Learn more about the audience to whom you will be speaking'
      },
      {
        id: '2',
        name: 'Select a topic',
        description: 'Select a topic that is of interest to the audience and to you'
      },
      {
        id: '3',
        name: 'Define the objective',
        description: 'Write the objective of the presentation in a single concise statement'
      }
    ]
  },
  {
    id: 2,
    name: 'IN PROGRESS',
    rows: [
      {
        id: '4',
        name: 'Look at drawings',
        description: 'How did they use line and shape? How did they shade?'
      },
      {
        id: '5',
        name: 'Draw from drawings',
        description: 'Learn from the masters by copying them'
      },
      {
        id: '6',
        name: 'Draw from photographs',
        description: 'For most people, it’s easier to reproduce an image that’s already two-dimensional'
      }
    ]
  },
  {
    id: 3,
    name: 'DONE',
    rows: [
      {
        id: '7',
        name: 'Draw from life',
        description: '1'
      },
      {
        id: '8',
        name: 'Take a class',
        description: '2'
      },
      {
        id: '9',
        name: 'Take a class',
        description: '3'
      }
    ]
  },
  {
    id: 4,
    name: 'DONE',
    rows: [
      {
        id: '10',
        name: 'Draw from life',
        description: '1'
      },
      {
        id: '11',
        name: 'Take a class',
        description: '2'
      },
      {
        id: '12',
        name: 'Take a class',
        description: '3'
      }
    ]
  }
]
 
const boardRepository = new BoardRepository(data);

export default function Workboard() {
	return (
	  <Board
	    boardRepository={boardRepository}
	    open={() => {}}
	    onDragEnd={() => {}}
	  />
	)
}