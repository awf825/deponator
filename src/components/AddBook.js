import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { ListBooks, AddBook } from './graphql.js';
import { API, graphqlOperation } from '@aws-amplify/api';

export default function AddBooks(props) {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');

	// onChangeText = (key, val) => {
	// 	if (key === 'title')
 //    	this.setState({ [key]: val })
 //  	}
	const addBook = async () => {
	    if (title === '' || author === '') return;
	    const book = { title: title, author: author };
	    try {
	      // const books = [...books, book];
	      // this.setState({ books, title: '', author: '' })
	      await API.graphql(graphqlOperation(AddBook, book));
	    } catch (err) {
	      console.log(err)
	    }
	}


	return (
		<>
	        <TextInput
	          style={styles.input}
	          value={title}
	          onChangeText={val => setTitle(val)}
	          placeholder="What do you want to read?"
	        />
	        <TextInput
	          style={styles.input}
	          value={author}
	          onChangeText={val => setAuthor(val)}
	          placeholder="Who wrote it?"
	        />
	        <Button onPress={addBook} title="Add to TBR" color="#eeaa55" />
	    </>
	)
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
    marginVertical: 10,
    color: 'red'
  },
  book: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10
  },
  title: { fontSize: 16 },
  author: { color: 'rgba(0, 0, 0, .5)' }
});
