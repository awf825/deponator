import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { DraggableGrid } from 'react-native-draggable-grid';

export default class Workgrid extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      data:[
        {name:'1',key:'one'},
        {name:'2',key:'two'},
        {name:'3',key:'three'},
        {name:'4',key:'four'},
        {name:'5',key:'five'},
        {name:'6',key:'six'},
        {name:'7',key:'seven'},
        {name:'8',key:'eight'},
        {name:'9',key:'night'},
        {name:'0',key:'zero'},
      ],
    };
    this.styles = StyleSheet.create({
      button:{
        width:150,
        height:100,
        backgroundColor:'blue',
      },
      wrapper:{
        paddingTop:100,
        width:'100%',
        height:'100%',
        justifyContent:'center',
      },
      item:{
        width:100,
        height:100,
        borderRadius:8,
        backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center',
      },
      item_text:{
        fontSize:40,
        color:'#FFFFFF',
      },
    });
  }

  renderItem = (item) => {
    return (
      <View
        style={this.styles.item}
        key={item.key}
      >
        <Text style={this.styles.item_text}>{item.name}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={this.styles.wrapper}>
        <DraggableGrid
          numColumns={4}
          renderItem={this.renderItem}
          data={this.state.data}
          onDragRelease={(data) => {
            this.setState({data});// need reset the props data sort after drag release
          }}
        />
      </View>
    );
  }
}