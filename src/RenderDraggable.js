/*
	Component called for each resource mapped in side effect in App.js. Each component needs to be passed the 'state grid' boundaries as props
	so they know what they'll land in. 
	
	Each square will need to be identified by both its index and its dimensions. For example, for a 3x2 grid (numbers are arbitrary):
	0 => x: 0-100, y: 0-100
	1 => x: 100-200, y: 0-100
	2 => x: 200-300, y: 0-100
	3 => x: 0-100, y: 100-200
	4 => x: 100-200, y: 100-200
	5 => x: 200-300, y: 100-200

	The above serves as the global representation that each panresponder will be made aware of. 

	By this dimensions table, the res will know to change the internal state of its position. When the app is closed, these new positions 
	will update the database (but only if that position has changed).

	The very tricky thing here will be bouncing a res out of its square when its touched by the incoming res that the user is holding. 
	How will internal state of invaded res be updated? Maybe, I could create a state hook to listen to whether or not one of my 
	grid dimensions is completely empty. If thats the case, I could then have another internal state hook here that will listen to 
	whether or not an adjacent grid is empty.

	If a res realizes that an adjacent square is empty, a chain reaction will start. The grids will only move to the left. So, 
	squares to the immediate left will have to move up and all the way to the right. 
*/

import React, { 
  useRef, 
  useEffect, 
  useState,
  useContext 
} from 'react';
import {  
  StyleSheet, 
  Text, 
  View,
  PanResponder,
  Animated
} from 'react-native';

import { 
  GridContext, 
  buildGrid, 
  changeColumn,
  togglePassive
} from "./components/contexts/GridContext";

import { 
  MotionContext, 
  reconcile
} from "./components/contexts/MotionContext";

let CIRCLE_RADIUS = 36;
const styles = StyleSheet.create({
	circle : {
      backgroundColor     : '#1abc9c',
      width               : CIRCLE_RADIUS*2,
      height              : CIRCLE_RADIUS*2,
      borderRadius        : CIRCLE_RADIUS
    },
  text : {
      marginTop   : 25,
      marginLeft  : 5,
      marginRight : 5,
      textAlign   : 'center',
      color       : '#fff'
  },
})


export default function RenderDraggable(props) {
  const [position, setPosition] = useState(props.position);
  const [delta, setDelta] = useState(null);
  const [moving, setIsMoving] = useState(false);
  const [outgoingPosition, setOutgoingPosition] = useState(null);
  const [gridState, dispatch] = useContext(GridContext);
  const [motionState, dispatchMotion] = useContext(MotionContext);
  const offset = useRef({ numberOfColumns: 0 });
  const oneColumn = (props.width / 3);
  const oneRow = (props.height / 3);

  useEffect(() => {
    var virtualGridSquare = {};
    virtualGridSquare['id'] = props.id;
    virtualGridSquare['pos'] = props.position;
    dispatch(buildGrid(virtualGridSquare))
  }, [props])

  useEffect(() => {
    const actionObj = gridState.grid.find(x => (x['id'] === props.id))
    if (actionObj && (actionObj.pos !== position)) {
      const delta = (actionObj.pos - position);
      dispatchMotion(reconcile(props.id, delta, position, gridState))
      return;
    }
  }, [gridState])

  useEffect(() => {
      var mL = motionState.movingList;
      if (mL && (mL.length > 0)) {
        if (mL[1]['id'] === props.id) {
          // console.log('I match motion to be: ', mL, props.id)
          const delta = (mL[0]['pos'] - mL[1]['pos'])
          //debugger
          // TODO for full grid motion logic to move to next row 
          offset.current.numberOfColumns += delta
          const vector = (oneColumn*delta)
          Animated.spring(
            pan,
            { toValue: { x: vector, y: 0 } }    
          ).start(() => {
            setPosition(motionState.movingList[1]['new'])
            setColumn(motionState.movingList[1]['new']+1)
            dispatch(togglePassive(motionState.movingList[1]['new'], props.id))
          })
        } 
      }
  }, [motionState])

  // useEffect(() => {
  //   debugger
  //   var offset = (column - props.column)*oneColumn 
  //   pan.setOffset({
  //     x: offset,
  //     y: 0
  //   })
  // }, [column])
  // the cardinal directions serve as the left, top, right, and 
  // bottom boundaries of each grid square
  const [eastBound, setEastBound] = useState(props.eastBound);
  const [southBound, setSouthBound] = useState(props.southBound);
  const [westBound, setWestBound] = useState(props.westBound);
  const [northBound, setNorthBound] = useState(props.northBound);
  const [column, setColumn] = useState(props.column);
  const [row, setRow] = useState(props.row);

  // https://reactjs.org/docs/hooks-reference.html#useref
  // Create an instance of Animated.ValueXY. This component will take care of interpolating X and Y values. We will 
  // run the animations by setting these values to the style of the element to animate.
  const pan = useRef(new Animated.ValueXY()).current

  // Create the PanResponder, which is responsible for doing the dragging. We are setting the handlers when the user 
  // moves and releases the element.
  const panResponder = useRef(
    PanResponder.create({
      // onStartShouldSetPanResponder: () => console.log('onStartShouldSetPanResponder', props.id)
      // onStartShouldSetPanResponderCapture: () => console.log('onStartShouldSetPanResponderCapture', props.id)
      onMoveShouldSetPanResponder: () => true,
      // onMoveShouldSetPanResponderCapture: () => console.log('onMoveShouldSetPanResponderCapture')
      // The handler will trigger when the element is moving. 
      // We need to set the animated values to perform the dragging correctly.
      onPanResponderGrant: (event, gestureState) => {
        // console.log('pan.x: @ onPanResponderGrant', pan.x)
        //console.log('gestureState @ onPanResponderGrant:', gestureState)
        //console.log('initial column @ onPanResponderGrant:', initialColumn);

        /* 
            Offset will always be the absolute value of the pan value set in onPanResponderRelease
            multiplied by the number of columns traversed. Offset holds negative values yes, but
            < or > than 0 is already handled by the offset ref hook. 
        */
        const offsetX = ((offset.current.numberOfColumns)*Math.abs(pan.x._value))
        pan.setOffset({
          x: offsetX,
          y: 0
        });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
        {
        	useNativeDriver: true,
        	listener: (event, gestureState) => {
            // I may not need the cardinal dir bounds, but, on the fly, if I have 
            // TWO grid resources with the same position, I can have the reducer 
            // method act accordingly and bounce the unheld res

            // The immediate bounds of each grid square is not exactly what I need. 
            // What I need is to know what 'sector' of the screen the resouce is
            // hovering over. From there, I can phone the reducer and let it know 
            // what resource(s) is/are in what square 
            // if x is LESS THAN 1/3 OF WIDTH, it is in column 1
            // if y is LESS THAN 1/3 OF HEIGHT, it is in row 1


            // if x is LESS THAN 2/3 OF WIDTH BUT ALSO GREATER THAN 1/3 OF WIDTH, it is in column 2
            // if y is LESS THAN 2/3 OF HEIGHT BUT ALSO GREATER THAN 1/3 OF HEIGHT, it is in row 2

            // if x is GREATER THAN 2/3 OF WIDTH, it is in column 3
            // if y is GREATER THAN 2/3 OF HEIGHT, it is in row 3
            if ((gestureState.moveX >= oneColumn) && (gestureState.moveX < (oneColumn*2))) {
              dispatch(changeColumn(2, props.position, props.id))
              //setColumn(2)
              setPosition(1)
            } else if (gestureState.moveX < oneColumn)  {
              dispatch(changeColumn(1, props.position, props.id));
              //setColumn(1)
              setPosition(0)
              
            } else {
              dispatch(changeColumn(3, props.position, props.id));
              //setColumn(3)
              setPosition(2)
            }
        	}
        }
      ),
      onPanResponderRelease: (event, gestureState) => {
        const eastBoundCond = gestureState.moveX < eastBound;
        const southBoundCond = gestureState.moveY < southBound;
        const westBoundCond = gestureState.moveX > westBound;
        const northBoundCond = gestureState.moveY > northBound && southBoundCond;
        // console.log('gestureState.moveX: ', gestureState.moveX)
        console.log('eastBoundCond: ', eastBoundCond);
        console.log('southBoundCond: ', southBoundCond);
        console.log('westBoundCond: ', westBoundCond);
        console.log('northBoundCond: ', northBoundCond);
        //debugger
        if (eastBoundCond && southBoundCond && northBoundCond && westBoundCond) {
          Animated.spring(
            pan,
            { 
              toValue: { 
                x: 0, 
                y: 0 
              } 
            }    
          ).start();
        } else {
          console.log('gestureState.dx', gestureState.dx);
          console.log('oneColumn:', oneColumn)
          if (gestureState.dx < 0 && southBoundCond) {
            //debugger
            offset.current.numberOfColumns -= 1
            // console.log(
            //   '[pan.x._value, pan.x._offset, pan.y._value, pan.x._offset, gestureState.x0, gestureState.moveX, gestureState.dx] @ onPanResponderRELEASE:', 
            //   pan.x._value, pan.x._offset, pan.y._value, pan.y._offset, gestureState.x0, gestureState.moveX, gestureState.dx)
              //console.log('gestureState.x0-oneColumn:', gestureState.x0-oneColumn)
            Animated.spring(
              pan,
              { 
                toValue: { 
                  x: -(oneColumn), 
                  y: 0 
                } 
              }    
            ).start();
          } else if ((gestureState.dx > (oneColumn-CIRCLE_RADIUS)) && southBoundCond) {
            console.log('((gestureState.dx > (oneColumn-CIRCLE_RADIUS)) && southBoundCond)')
            offset.current.numberOfColumns += 1
            Animated.spring(
              pan,
              { 
                toValue: { 
                  x: oneColumn, 
                  y: 0 
                }
              }    
            ).start();   
          }
          // find out which square we landed in !!!!!!!
            // if horizontalTravel < 0 && southBoundCond, WE WENT LEFT
              // southboundCond is true ? then I didn't go far enough to leave the square in the south direction
            // if horizontalTravel > 373.66666 && southBoundCond, WE WENT RIGHT

          // spring to the top left corner of that square !!!!!!!!
            // left => x: -373.66666, y: 0
            // right => x: 373.66666, y: 0
            // up => x: 0, y: -100?
            // down => x: 0, y: 100

            // down-left => x: -373.66666, y: 100,
            // down-right => x: 373.66666, y: 100,
            // up-right => x: 373.66666, y: -100,
            // up-left => x: -373.66666, y: -100
            // Animated.spring(
            //   pan,
            //   { toValue: { x: 100, y: 100 } }    
            // ).start();

          // setState to reflect the new bounds  !!!!!!!!


          //pan.flattenOffset();
        }
      }
    })
  ).current;

  return (
      <Animated.View 
        {...panResponder.panHandlers}
        style={[
          // getLayout method returns the left and top properties with the correct 
          // values for each frame during the animation.
        	pan.getLayout(), 
        	styles.circle
        ]}
      >
        <Text style={styles.text}>{props.id}</Text>
      </Animated.View>
  );
}