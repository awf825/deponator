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
import React, { 
  useState, 
  useEffect, 
  useRef 
} from 'react';
import { ListBooks, AddBook } from './src/components/graphql.js';
import RenderDraggable from './src/RenderDraggable.js';
// import { Tab } from 'react-native-elements';
import AddBooks from './src/components/AddBook.js';
let Window = Dimensions.get('window');
console.log("Dimensions.get('window'): ", Window)
let styles = StyleSheet.create({
    mainContainer: {
        flex    : 1
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
  const [dropZoneValues, setDropZoneValues] = useState(null);
  const [virtualGrid, setVirtualGrid] = useState([]);

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

  /***
    Instead of saving on the fly to the database, save to the database when the user closes the
    work 'session.' This way, the positions of the cards will be completely ephemeral—they will not 
    need to be consistenly stored to the db, saving writes. This will go down something like this:

    Say three resources are coming back from db when app mounts, writing array of objects for ease of 
    reading. These resources are fresh and have not been tampered with, as id === position in each case:
    [
      {
        id: 0,
        position: 0,
      },
      {
        id: 1,
        position: 1
      },
      {
        id: 2,
        id: 2,
      }
    ]

    As the resources are being mapped in this next side effect, i is accounting for the
    position of the 'state grid.' 

    @key(name: "booksByPosition",fields: ["type","position"],queryField: "booksByPosition")
  ***/

  useEffect(() => {
    console.log('books.sorted at second useEffect: ', books.sort((a,b) => (a.position > b.position) ? 1 : -1))
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
                        width={w}
                        height={h}
                        position={b.position}
                      />
                    </View>
                  )
                });
    setBoardView(newBoardView)
  }, [books])

  //// const buildGridState = (evt) => {
  //   /*console.log("evt.nativeEvent @ buildGridState = (evt) => { ", evt.nativeEvent)*/
  // } 

  return (
    <View 
      style={styles.mainContainer}
      // onLayout={(evt) => setDropZoneValues(evt.nativeEvent.layout)}
      // onLayout = {(evt) => buildGridState(evt)}
    >
      {boardView}
    </View>
  );
}

export default withAuthenticator(App);