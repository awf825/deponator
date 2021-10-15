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

import React, { useRef, useEffect } from 'react';
import {  
  StyleSheet, 
  Text, 
  View,
  PanResponder,
  Animated
} from 'react-native';
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
  const pan = useRef(new Animated.ValueXY()).current

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
        pan.setValue({
          x: 0,
          y: 0
        })
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
        {
        	useNativeDriver: true,
        	listener: (event, gestureState) => {
        		console.log('onPanResponderMove [event, gesture]: ', event, gestureState)
        	}
        }
      ),
      onPanResponderRelease: () => {
      	// if the user releases the res inside of its own grid square, spring the 
      	// res back to where it was 
      	// if the user releases the res inside of another grid square, find out 
      	// square the res has been pulled from and what square the res is trying to 
      	// go to. If the release is 'valid', spring the res to its new position. 
      	// THE RES SHOULD ALWAYS SPRING
        pan.flattenOffset();
      }
    })
  ).current;

  return (
      <Animated.View 
        {...panResponder.panHandlers}
        style={[
        	pan.getLayout(), 
        	styles.circle
        ]}
      >
        <Text style={styles.text}>{props.idx}</Text>
      </Animated.View>
  );
}

/*
    //// useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue). 
    // The returned object will persist for the full lifetime of the component. 
    // https://reactjs.org/docs/hooks-reference.html#useref

    // 1) Create an instance of Animated.ValueXY. This component will take care of interpolating X and Y values. We will 
    // run the animations by setting these values to the style of the element to animate.

    // 2) Create the PanResponder, which is responsible for doing the dragging. We are setting the handlers when the user 
    // moves and releases the element.

    // 3) The handler will trigger when the element is moving. We need to set the animated values to perform the dragging correctly.
    
    // 4) Write the code to execute when the element is released. For now it is empty, but soon we will animate the circle 
    // back to the center.

    // pan: 
    //   The getLayout method returns the left and top properties with the correct values for each frame during the animation.

    //   Use the Animated.spring method to run the animation. This method will run the animation at a constant speed and 
    //   we can control the friction and tension. The first parameter accepts the animation values. The second parameter 
    //   is a configuration object. Here, we are defining only the toValue, which is the origin coordinates. This 
    //   will return the circle to the middle.

  //I've gone ahead and set two panResponders. This actually works, BUT both orbs are bound to the same state. 
  // My grid will have a different state handling scheme:
  
  //    At the level of each 'card', need to know if the card is selected. If thats the case, I need to know what grid 
  //    position the card is in, what position(s) its 'hovered' over, and what position its dropped in, and if 
  //    that position is even valid. If its not valid, the card needs to be bounced back to where it was selected from. 
  //    If it IS valid, that card can be dropped, but the other cards need to be updated accordingly, this is a good 
  //    into the 'grid', 'wrapper' or 'parent' state.

  //    The grid needs to be aware of the order of the cards as the user updates them. This wil most likely come down to 
  //    attaching a property at the deeper level of the card resources in the backend. I think a sound approach to dealing 
  //    with the grid would be designing dimensions based entirely upon the number of resources created/available and storing 
  //    the dimensions in state. For example, if I have 9 resources, I will have a 3x3 grid (on tablet). If I add two resources
  //    totalling 11, I will make sure the state is appraised of the fact that my grid is 4x3+2, and that that 3rd slot in
  //    the 4th row is OFF LIMITS. 
*/
