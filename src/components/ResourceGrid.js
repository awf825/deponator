import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image } from 'react-native';
import Card from './Card.js'

const ResourceGrid = (props) => {
	const [dataSource, setDataSource] = useState([]);

	useEffect(() => {
	    let items = Array.apply(null, Array(60)).map((v, i) => {
	      return {
	        id: i,
	        src: 'http://placehold.it/200x200?text=' + (i + 1)
	      };
	    });
	    setDataSource(items);
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={props.books}
				renderItem={({item}) => (
					<View 
						style={{
							flex: 1,
							flexDirection: 'column',
							margin: 1
						}}
					>
						<Card title={item.title} author={item.author} />
					</View>
				)}
				numColumns={3}
				keyExtractor={(item, index) => index}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});

export default ResourceGrid;