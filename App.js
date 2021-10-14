/*
  !!! https://docs.amplify.aws/start (React Native & Expo)

  When you initialize a new Amplify project, a few things happen:

  It creates a top level directory called amplify that stores your backend definition. During the tutorial you'll add capabilities such as a GraphQL API 
  and authentication. As you add features, the amplify folder will grow with infrastructure-as-code templates that define your backend stack. 
  Infrastructure-as-code is a best practice way to create a replicable backend stack.

  It creates a file called aws-exports.js in the src directory that holds all the configuration for the services you create with Amplify. 
  This is how the Amplify client is able to get the necessary information about your backend services.

  It modifies the .gitignore file, adding some generated files to the ignore list.

  A cloud project is created for you in the AWS Amplify Console that can be accessed by running amplify console. The Console provides a list of backend 
  environments, deep links to provisioned resources per Amplify category, status of recent deployments, and instructions on how to promote, 
  clone, pull, and delete backend resources.
*/

// import { withAuthenticator } from 'aws-amplify-react-native';
import { 
  TextInput, 
  Button, 
  StyleSheet, 
  Text, 
  View,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native'
import awsmobile from './aws-exports';
Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

import { API, graphqlOperation } from '@aws-amplify/api';
import { StatusBar } from 'expo-status-bar';
import React, { 
  useState, 
  useEffect, 
  useRef 
} from 'react';
import { ListBooks, AddBook } from './src/components/graphql.js';
import { Tab } from 'react-native-elements';
import AddBooks from './src/components/AddBook.js';
let CIRCLE_RADIUS = 36;
let Window = Dimensions.get('window');
console.log("Dimensions.get('window'): ", Window)
let styles = StyleSheet.create({
    mainContainer: {
        flex    : 1
    },
    dropZone    : {
        height         : 100,
        backgroundColor:'#2c3e50'
    },
    text        : {
        marginTop   : 25,
        marginLeft  : 5,
        marginRight : 5,
        textAlign   : 'center',
        color       : '#fff'
    },
    draggableContainer: {
        position    : 'absolute',
        top         : Window.height/2 - CIRCLE_RADIUS,
        left        : Window.width/2 - CIRCLE_RADIUS,
    },
    circle      : {
        backgroundColor     : '#1abc9c',
        width               : CIRCLE_RADIUS*2,
        height              : CIRCLE_RADIUS*2,
        borderRadius        : CIRCLE_RADIUS
    },
    container: {
      flex: 1,
      backgroundColor: 'black',
      paddingHorizontal: 10,
      paddingTop: 50
    },
    input: {
      // height: 50,
      borderBottomWidth: 2,
      borderBottomColor: 'blue',
      marginVertical: 10
    },
    book: {
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingVertical: 10
    },
    title: { fontSize: 16 },
    author: { color: 'rgba(0, 0, 0, .5)' }
});



function App() {
  const [books, setBooks] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [showDraggable, setShowDraggable] = useState(true);
  const [dropZoneValues, setDropZoneValues] = useState(null);

  //const [gridZoneValues, setGridZoneValues] = useState(null);
  const [boardView, setBoardView] = useState(null)

  useEffect(() => {
    const getResult = async () => {
      const books = await API.graphql(graphqlOperation(ListBooks));
      // console.log('books: ', books)
      setBooks(books.data.listBooks.items);
    };

    try {
      getResult();
    } catch(err) {
      console.log(err)
    }
  }, [])

  /*
    In second side effect, build the boardView based on the amount of books the user has saved.

    Initialize the height of the device window (static) as well as the width of what each block
    will be (arbitrarily 3, but this can be based on a user setting or the window width itself).
    Additionally, init 'tick' values for both the x and y axis.

    As the books are looped through, reconcile the tick values on each iteration. If i%3 is 
    bouncing to 0, this means we should start a new row (dx = 0, dy + 1). In any other event, 
    given that i > 0, dx should tick up. Use the tick values to calculate the (arbitrary) top
    and (dynamic based on width) left sides of each square.    
  */

  useEffect(() => {
    console.log('books at second useEffect: ', books)
    const w = Window.width / 3;
    const h = Window.height;
    let dx = 0;
    let dy = 0; 
    const newBoardView = books.map((b,i) => {
                  if (i>0) {
                    dx += 1
                    if (i%3 === 0) {
                      dx = 0
                      dy += 1
                    }
                  }
                  const calcTop = (0+(dy*100))
                  const calcLeft = (0+(dx*w))
                  const s = StyleSheet.create({
                    gridSquare: {
                      position: 'absolute',
                      borderColor: '#000000',
                      top: calcTop,
                      left: calcLeft,
                      width: w,
                      height: 100,
                      borderWidth: 1
                    }
                  });
                  return (
                    <View style={s.gridSquare} key={i+1}>
                      {renderDraggable(i)}
                    </View>
                  )
                });
    setBoardView(newBoardView)
  }, [books])


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

  const panOne = useRef(new Animated.ValueXY()).current

  const panResponderOne = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, {
      dx: panOne.x,
      dy: panOne.y
    }], {}),
    onPanResponderRelease: (e, gesture) => {
      if (isDropZone(gesture)) {
        console.log('GESTURE: ', gesture)
        setShowDraggable(false)
      } else {
        Animated.spring(
          panOne,
          {toValue:{x:0,y:0}}
        ).start()
      }
    }
  });

  const renderDraggable = (idx) => {
    if (showDraggable) {
      return (
          <Animated.View 
            {...panResponderOne.panHandlers}
            style={[panOne.getLayout(), styles.circle]}
          >
            <Text style={styles.text}>{idx}</Text>
          </Animated.View>
      );
    }
  }

  ///// // Next, we need to set the value of the dropZoneValues property dynamically 
  // Next, we need to set the value of the dropZoneValues property dynamically  and we need to know the width and height (or x and y) from the drop zone 
  // container. These values will change based on the device.

  // First, we first define a callback where we set the values for the property.
  // Second, we set the callback to the onLayout event. This event will be fired 
  // when the view gets rendered on the screen and contains all the sizing 
  // based on the assigned styles.



  const isDropZone = (gesture) => {
    // var dz = dropZoneValues;
    console.log('GESTURE: ', gesture)
    // It seems that dz.y is always set to 0. I don't know why this is. but 
    // first condition will always be true
    // BUT this seems to be working. dz.y + dz.height is always 100. 
    // As you move FUTHER DOWN THE SCREEN, gesture.moveY increases.
    // As you move FURTHER TO THE RIGHT, gesture.moveX increases.

    // return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
  }

  const buildGridState = (evt) => {
    console.log("evt.nativeEvent @ buildGridState = (evt) => { ", evt.nativeEvent)
  } 

  return (
    <View 
      style={styles.mainContainer}
      // onLayout={(evt) => setDropZoneValues(evt.nativeEvent.layout)}
      onLayout = {(evt) => buildGridState(evt)}
      // style={styles.dropZone}
    >
      {boardView}
    </View>
  );
}

export default withAuthenticator(App);