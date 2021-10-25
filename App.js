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
/* REACT AND RN */
import { 
  StyleSheet, 
  Text, 
  View,
  Dimensions
} from 'react-native';
import React, { 
  useState, 
  useEffect, 
  useRef,
  useReducer
} from 'react';

/* AWS AMPLIFY */
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native'
import { API, graphqlOperation } from '@aws-amplify/api';
import awsmobile from './aws-exports';
Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
});

/* IMPORTED COMPONENTS */
import { ListBooks, AddBook } from './src/components/graphql.js';
import RenderDraggable from './src/RenderDraggable.js';
// import { Tab } from 'react-native-elements';
import AddBooks from './src/components/AddBook.js';

import {
  GridContext,
  gridReducer,
} from "./src/components/contexts/GridContext";

/* STYLES AND MISC */
let Window = Dimensions.get('window');
let styles = StyleSheet.create({
    mainContainer: {
        flex    : 1
    },
    book: {
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingVertical: 10
    }
});

function App() {
  // gather user resources
  const [books, setBooks] = useState([]);
  // boardView built with resources and passed as children to main view
  const [boardView, setBoardView] = useState(null);
  // use context and reducer hooks to build a virtual rep of the grid state
  const [gridState, dispatch] = useReducer(
    gridReducer, 
    { grid: [] }
  )

  useEffect(() => {
    const getResult = async () => {
      const books = await API.graphql(graphqlOperation(ListBooks));
      // sort books so graphql doesn't have to
      const stateOut = books.data.listBooks.items.sort((a,b) => {
        return (a.position > b.position) ? 1 : -1
      })
      setBooks(stateOut);
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
                  console.log('book:', b)

                  console.log('calcTop: ', calcTop);
                  console.log('calcLeft: ', calcLeft);

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
                      <RenderDraggable 
                        idx={i}
                        westBound={calcLeft}
                        northBound={calcTop}
                        eastBound={calcLeft+(w)}
                        southBound={calcTop+100}
                        width={Window.width}
                        height={Window.height}
                        row={dy+1}
                        column={dx+1}
                        id={b.id}
                        position={b.position}
                        // gridState={gridState}
                      />
                    </View>
                  )
                });
    setBoardView(newBoardView)
  }, [books])

  

  return (
    <GridContext.Provider value={[gridState, dispatch]}>    
      <View 
        style={styles.mainContainer}
        // onLayout = {(evt) => buildGridState(evt)}
      >
        {boardView}
      </View>
    </GridContext.Provider>
  );
}

export default withAuthenticator(App);