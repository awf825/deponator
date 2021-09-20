import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image } from 'react-native';

const Card = (props) => {
	return (
		<View style={styles.card}>
			<Text style={styles.title}>{props.title}</Text>
		</View>
	)
}

export default Card;

const styles = StyleSheet.create({
    
    card:{
        marginVertical:15,
        backgroundColor:'red',
        height: '80%',
        textAlign: 'center'
    },
    title:{
        marginLeft:0,
        marginTop: '5%',
        padding:0,
        width:'100%',
        height:'100%',
        borderRadius:30,
        position:'relative',
        opacity:0.65,
        textAlign: 'center'
    }
})