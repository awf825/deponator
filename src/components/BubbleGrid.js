/*
	https://openbase.com/js/react-native-drag-drop-grid-library/documentation
*/

import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { DragDropGrid } from 'react-native-drag-drop-grid-library';

export default function BubbleGrid() {
	const alphabets = [
		'1','2','3','4','5','6',
   		'7','8','9','10','11','12',
   		'13','14','15','16','17','18',
   		'19','20','21','22','23','24'
   	]
   	var sortGrid;
	return (
	 	<View style={{ flex: 1 }}>
	     <DragDropGrid
	      ref={sortGrid => {
	        sortGrid = sortGrid;
	      }}
	      blockTransitionDuration={400}
	      activeBlockCenteringDuration={200}
	      itemsPerRow={4}
	      dragActivationTreshold={200}
	      onDragRelease   = { (itemOrder) => {}
	      //	console.log("Drag was released, the blocks are in the following order: ", itemOrder)       
	      }   
	      onDragStart = { (key) => {}
	      //	console.log("Some block is being dragged now!",key) 
	      }   
	      onMerge = {(itemKey,mergeBlockKey) => {}
	      	//console.log("item and merge item",itemKey,mergeBlockKey)
	      }
	      merge={true}>
	        {
	          alphabets.map( (letter, index) =>
	            <View key={letter}>
	            <Text
	             style={{color: 'white', fontSize: 50}}>{letter}</Text>
	            </View>
	          )
	        }
	      </DragDropGrid>
	    </View>
	)
}

