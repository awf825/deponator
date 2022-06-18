import React, { memo, useState, useCallback } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context'
// import _ from 'lodash'
import GridView from 'react-native-draggable-gridview'

/**
 * App
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <Container />
    </SafeAreaProvider>
  )
}

/**
 * Container
 */
const Container = memo(() => {
  const { top, bottom } = useSafeAreaInsets()
  const [editing, setEditing] = useState(false)
  const [data, setData] = useState<Data[]>(
    Array.from(new Array(14)).map((v, i) => newData(i))
  )

  const onPressEdit = useCallback(() => {
    setEditing(!editing)
  }, [editing])

  const locked = useCallback((item) => item == '+', [])

  const renderLockedItem = useCallback(
    () => <LockedItem editing={editing} onPress={onPressAdd} />,
    [editing, data]
  )

  const renderItem = useCallback(
    (item) => (
      <Item item={item} editing={editing} onPressDelete={onPressDelete} />
    ),
    [editing, data]
  )

  const onBeginDragging = useCallback(() => !editing && setEditing(true), [
    editing,
  ])

  const onPressCell = useCallback((item) => !editing && alert(item.color), [
    editing,
  ])

  const onPressAdd = useCallback(
    () => !editing && setData([newData(data.length + 1), ...data]),
    [editing, data]
  )

  const onReleaseCell = useCallback(
    (items: any[]) => {
      const data1 = items.slice(1)
      if (!(data === data1)) setData(data1)
    },
    [data]
  )

  const onPressDelete = useCallback(
    (item: Data) => setData(data.filter((v) => v.id != item.id)),
    [data]
  )

  return (
    <View style={{ flex: 1 }}>
      <GridView
        data={['+', ...data]}
        keyExtractor={(item) => (item == '+' ? item : item.id)}
        renderItem={renderItem}
        renderLockedItem={renderLockedItem}
        locked={locked}
        onBeginDragging={onBeginDragging}
        onPressCell={onPressCell}
        onReleaseCell={onReleaseCell}
        numColumns={3}
        delayLongPress={editing ? 50 : 500}
        containerMargin={{ top: 60 + top, bottom, left: 2, right: 2 }}
      />
      <Header top={top} editing={editing} onPress={onPressEdit} />
    </View>
  )
})

/**
 * Data
 */
const colors = ['red', 'orange', 'green', 'cyan', 'blue', 'purple', 'pink']

interface Data {
  id: string
  color?: string
}

const newData = (i: number): Data => ({
  id: uuid(),
  color: colors[i % colors.length],
})

/**
 * Item
 */
interface ItemProps {
  item: Data
  editing: boolean
  onPressDelete: (item: Data) => void
}

const Item = memo(({ item, editing, onPressDelete }: ItemProps) => {
  return (
    <View style={[styles.item, { backgroundColor: item.color || 'gray' }]}>
      <Text style={{ color: '#fff', fontSize: 18 }}>{item.color}</Text>
      {editing && <DeleteButton onPress={() => onPressDelete(item)} />}
    </View>
  )
})

const DeleteButton = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.delete} onPress={onPress}>
    <View style={styles.deleteContainer}>
      <Text style={{ color: '#fff' }}>x</Text>
    </View>
  </TouchableOpacity>
))

/**
 * LockedItem
 */
interface LockedItemProps {
  editing: boolean
  onPress: () => void
}

const LockedItem = memo(({ editing, onPress }: LockedItemProps) => (
  <TouchableOpacity
    style={{ flex: 1 }}
    activeOpacity={editing ? 1 : 0.5}
    onPress={onPress}
  >
    <View style={[styles.item, { opacity: editing ? 0.25 : 1 }]}>
      <Text style={{ fontSize: 48 }}>+</Text>
    </View>
  </TouchableOpacity>
))

/**
 * Header
 */
interface HeaderProps {
  top: number
  editing: boolean
  onPress: () => void
}

const Header = memo(({ top, editing, onPress }: HeaderProps) => (
  <View style={[styles.header, { height: 60 + top }]}>
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>GRID</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.headerItem}>{editing ? 'DONE' : 'EDIT'}</Text>
      </TouchableOpacity>
    </View>
  </View>
))

/**
 * UUID
 */
const uuid = (): string => {
  // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
  // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  let chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('')
  for (let i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
      case 'x':
        chars[i] = Math.floor(Math.random() * 16).toString(16)
        break
      case 'y':
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16)
        break
    }
  }
  return chars.join('')
}

/**
 * Style
 */
const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  delete: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteContainer: {
    width: 20,
    height: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0009',
  },
  header: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#fffe',
    justifyContent: 'flex-end',
  },
  headerTitle: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  headerItem: { fontSize: 18, color: 'gray' },
  headerContainer: {
    height: 60,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
})


// /*
//   !!! https://docs.amplify.aws/start (React Native & Expo)

//   When you initialize a new Amplify project, a few things happen:

//   It creates a top level directory called amplify that stores your backend definition. During the tutorial you'll add capabilities such as a GraphQL API 
//   and authentication. As you add features, the amplify folder will grow with infrastructure-as-code templates that define your backend stack. 
//   Infrastructure-as-code is a best practice way to create a replicable backend stack.

//   It creates a file called aws-exports.js in the src directory that holds all the configuration for the services you create with Amplify. 
//   This is how the Amplify client is able to get the necessary information about your backend services.

//   It modifies the .gitignore file, adding some generated files to the ignore list.

//   A cloud project is created for you in the AWS Amplify Console that can be accessed by running amplify console. The Console provides a list of backend 
//   environments, deep links to provisioned resources per Amplify category, status of recent deployments, and instructions on how to promote, 
//   clone, pull, and delete backend resources.
// */
// /* REACT AND RN */
// import { 
//   StyleSheet, 
//   Text, 
//   View,
//   Dimensions
// } from 'react-native';
// import React, { 
//   useState, 
//   useEffect, 
//   useRef,
//   useReducer
// } from 'react';

// import GridView from 'react-native-draggable-gridview'
// import Workgrid  from './src/components/Workgrid.js';

// // /* AWS AMPLIFY */
// // import Amplify from 'aws-amplify';
// // import { withAuthenticator } from 'aws-amplify-react-native'
// // import { API, graphqlOperation } from '@aws-amplify/api';
// // import { Auth } from '@aws-amplify/auth';
// // import awsmobile from './aws-exports';
// // Amplify.configure({
// //   ...awsmobile,
// //   Analytics: {
// //     disabled: true,
// //   },
// //   graphql_headers: async () => {
// //     const currentSession = await Auth.currentSession();
// //     return { Authorization: currentSession.getIdToken().getJwtToken() };
// //   }
// // });

// /* IMPORTED COMPONENTS */
// // import { ListBooks, AddBook } from './src/components/graphql.js';
// import RenderDraggable from './src/RenderDraggable.js';
// // import { Tab } from 'react-native-elements';
// // import AddBooks from './src/components/AddBook.js';

// import {
//   GridContext,
//   gridReducer,
// } from "./src/components/contexts/GridContext";
// import {
//   MotionContext,
//   motionReducer,
// } from "./src/components/contexts/MotionContext";

// /* STYLES AND MISC */
// let Window = Dimensions.get('window');
// let styles = StyleSheet.create({
//     mainContainer: {
//         flex    : 1
//     },
//     book: {
//       borderBottomWidth: 1,
//       borderBottomColor: '#ddd',
//       paddingVertical: 10
//     }
// });

// function App() {
//   // gather user resources
//   const [data, setData] = useState(['1', '2', '3', '4', '5', '6'])
//   // const [books, setBooks] = useState([]);
//   const [whichView, setWhichView] = useState('CASE');
//   // boardView built with resources and passed as children to main view
//   const [boardView, setBoardView] = useState(null);
//   // use context and reducer hooks to build a virtual rep of the grid state
//   const [gridState, dispatch] = useReducer(
//     gridReducer, 
//     { 
//       whichView: 'CASE',
//       whichClick: '',
//       grid: [
//         {
//           "id":1,
//           "pos":1
//         },
//         {
//           "id":2,
//           "pos":2
//         },
//         {
//           "id":3,
//           "pos":3
//         }
//       ]
//     }
//   )

//   const [motionState, dispatchMotion] = useReducer(
//     motionReducer,
//     {
//       movingList: []
//     }

//   )

//   // useEffect(() => {
//   //   const getResult = async () => {
//   //     const books = await API.graphql(graphqlOperation(ListBooks));
//   //     /* get all attached resources here if I have to */
//   //     // sort books so graphql doesn't have to
//   //     const stateOut = books.data.listBooks.items.sort((a,b) => {
//   //       return (a.position > b.position) ? 1 : -1
//   //     })
//   //     setBooks(stateOut);
//   //   };

//   //   try {
//   //     getResult();
//   //   } catch(err) {
//   //     console.log(err)
//   //   }
//   // }, [])

//   /*
//     In second side effect, build the boardView based on the amount of books the user has saved.

//     Initialize the height of the device window (static) as well as the width of what each block
//     will be (arbitrarily 3, but this can be based on a user setting or the window width itself).
//     Additionally, init 'tick' values for both the x and y axis (dx,dy).

//     As the books are looped through, reconcile the tick values on each iteration. If i%3 is 
//     bouncing to 0, this means we should start a new row (dx = 0, dy + 1). In any other event, 
//     given that i%3 != 0, dx should tick up. Use the tick values to calculate the (arbitrary) top
//     and (dynamic based on width) left sides of each square.    
//   */

//   useEffect(() => {
//     const w = Window.width / 3;
//     const h = Window.height;
//     let dx = 0;
//     let dy = 0; 
//     // var virtualGridSquare = {};
//     // virtualGridSquare['id'] = props.id;
//     // virtualGridSquare['pos'] = props.position;
//     // dispatch(buildGrid(virtualGridSquare))
//     const newBoardView = [1,2,3].map((b,i) => {
//                   if (i>0) {
//                     dx += 1
//                     if (i%3 === 0) {
//                       dx = 0
//                       dy += 1
//                     }
//                   }
//                   const calcTop = (0+(dy*100))
//                   const calcLeft = (0+(dx*w))
//                   // console.log('book:', b)

//                   // console.log('calcTop: ', calcTop);
//                   // console.log('calcLeft: ', calcLeft);

//                   const s = StyleSheet.create({
//                     gridSquare: {
//                       position: 'absolute',
//                       borderColor: '#000000',
//                       top: calcTop,
//                       left: calcLeft,
//                       width: w,
//                       height: 100,
//                       borderWidth: 1
//                     }
//                   });
//                   return (
//                     <View style={s.gridSquare} key={i+1}>
//                       <RenderDraggable 
//                         idx={i}
//                         westBound={calcLeft}
//                         northBound={calcTop}
//                         eastBound={calcLeft+(w)}
//                         southBound={calcTop+100}
//                         width={Window.width}
//                         height={Window.height}
//                         row={dy+1}
//                         column={dx+1}
//                         id={b.id}
//                         position={b.position}
//                         // gridState={gridState}
//                       />
//                     </View>
//                   )
//                 });
//     setBoardView(newBoardView)
//   }, [])

//   useEffect(() => {
//     const w = Window.width / 3;
//     const h = Window.height;
//     let dx = 0;
//     let dy = 0; 
//     switch (gridState.whichView) {
//       case "CASE":
//         console.log("case view in effect")
//         const baseView = [1,2,3].map((b,i) => {
//                 if (i>0) {
//                   dx += 1
//                   if (i%3 === 0) {
//                     dx = 0
//                     dy += 1
//                   }
//                 }
//                 const calcTop = (0+(dy*100))
//                 const calcLeft = (0+(dx*w))
//                 // console.log('book:', b)

//                 // console.log('calcTop: ', calcTop);
//                 // console.log('calcLeft: ', calcLeft);

//                 const s = StyleSheet.create({
//                   gridSquare: {
//                     position: 'absolute',
//                     borderColor: '#000000',
//                     top: calcTop,
//                     left: calcLeft,
//                     width: w,
//                     height: 100,
//                     borderWidth: 1
//                   }
//                 });
//                 return (
//                   <View style={s.gridSquare} key={i+1}>
//                     <RenderDraggable 
//                       idx={i}
//                       westBound={calcLeft}
//                       northBound={calcTop}
//                       eastBound={calcLeft+(w)}
//                       southBound={calcTop+100}
//                       width={Window.width}
//                       height={Window.height}
//                       row={dy+1}
//                       column={dx+1}
//                       id={b}
//                       position={b}
//                       // gridState={gridState}
//                     />
//                   </View>
//                 )
//               });
//         setBoardView(baseView)
//         return;
//     //   case "DEPO":
//     //     const idx = [1,2,3].findIndex(b => b['id'] === gridState.whichClick);
//     //     const secondView = books[idx].depos.items.map((b,i) => {
//     //                       if (i>0) {
//     //               dx += 1
//     //               if (i%3 === 0) {
//     //                 dx = 0
//     //                 dy += 1
//     //               }
//     //             }
//     //             const calcTop = (0+(dy*100))
//     //             const calcLeft = (0+(dx*w))
//     //             // console.log('book:', b)

//     //             // console.log('calcTop: ', calcTop);
//     //             // console.log('calcLeft: ', calcLeft);

//     //             const s = StyleSheet.create({
//     //               gridSquare: {
//     //                 position: 'absolute',
//     //                 borderColor: '#000000',
//     //                 top: calcTop,
//     //                 left: calcLeft,
//     //                 width: w,
//     //                 height: 100,
//     //                 borderWidth: 1
//     //               }
//     //             });
//     //             return (
//     //               <View style={s.gridSquare} key={i+1}>
//     //                 <RenderDraggable 
//     //                   idx={i}
//     //                   westBound={calcLeft}
//     //                   northBound={calcTop}
//     //                   eastBound={calcLeft+(w)}
//     //                   southBound={calcTop+100}
//     //                   width={Window.width}
//     //                   height={Window.height}
//     //                   row={dy+1}
//     //                   column={dx+1}
//     //                   id={b.id}
//     //                   position={b.position}
//     //                   // gridState={gridState}
//     //                 />
//     //               </View>
//     //             )
//     //     });
//     //     setBoardView(secondView)
//     //     return;
//     //   default:
//     //     return;
//     }
//   }, [gridState.whichView])

  

//   return (
//       <GridView
//           data={data}
//           numColumns={3}
//           renderItem={(item) => (
//               <View style={{ flex: 1, margin: 1, justifyContent: 'center', backgroundColor: 'gray' }}>
//               <Text style={{ textAlign: 'center' }}>{item}</Text>
//               </View>
//           )}
//           onReleaseCell={(items) => setData(items)}
//       />
//     // <MotionContext.Provider value={[motionState, dispatchMotion]}>
//     //   <GridContext.Provider value={[gridState, dispatch]}>    
//     //   </GridContext.Provider>
//     // </MotionContext.Provider>
//   );
// }

// export default App;