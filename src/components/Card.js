import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image } from 'react-native';

const Card = (props) => {
	return (
		<View style={styles.card}>
			<Text style={styles.title}>{props.title}</Text>
            <Text style={styles.title}>{props.author}</Text>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.title}>{props.author}</Text>
		</View>
	)
}

export default Card;

const styles = StyleSheet.create({
    
    card:{
        marginVertical:15,
        width:'100%',
        borderRadius:35,
        backgroundColor:'red',
        textAlign: 'center'
    },
    title:{
        marginLeft:0,
        padding:0,
        width:'100%',
        height:'100%',
        borderRadius:30,
        position:'relative',
        opacity:0.65
    }
})