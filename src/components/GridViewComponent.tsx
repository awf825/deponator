import React, { 
    memo, 
    useState, 
    useCallback,
    useEffect
  } from 'react'
  import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
  import { useSafeAreaInsets } from 'react-native-safe-area-context'
  import GridView from 'react-native-draggable-gridview'
  import axios from 'axios'
  
  export const GridContainer = memo(() => {
    interface Data {
      uuid: string,
      _id: string,
      name: string,
      calories: string,
      description: string,
      color: string
    }
    
    const newData = (i: number, v?: any): Data => (
      {
        uuid: uuid(),
        _id: v._id,
        name: v.name,
        calories: v.calories,
        description: v.description,
        color: 'red'
      }
    )

    const { top, bottom } = useSafeAreaInsets()
    const [editing, setEditing] = useState(false)
    const [data, setData] = useState<Data[]>([])
  
    useEffect(() => {
      axios.get("http://localhost:3001/foods/get-all-foods")
      .then(res => {
        console.log(res.data.foods)
        setData(res.data.foods.map((v : string | number, i : number) => newData(i, v)))
      })
      .catch(err => {
        console.log(err)
      })
    }, [])
  
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
  
    /* onPressCell can only be called when not in editing mode */
  
    // const onPressCell = useCallback((item) => 
    //   !editing && 
    //   axios.get(`http://localhost:3001/places/get-places-by-food/${item._id}`)
    //   .then(res => {
    //     console.log('res: ', res.data.places)
    //     setData(res.data.places.map((v : string | number, i : number) => newData(i, v)))
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   }), 
    //   [editing, data]
    // )
  
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
      (item: Data) => setData(data.filter((v) => v.uuid != item.uuid)),
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
        //   onPressCell={onPressCell}
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
        <Text style={{ color: '#fff', fontSize: 18 }}>{item.name}</Text>
        <Text style={{ color: '#fff', fontSize: 18 }}>{item.calories}</Text>
        <Text style={{ color: '#fff', fontSize: 18 }}>{item.description}</Text>
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
  