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
import { TextInput, Button, StyleSheet, Text, View } from 'react-native';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native'
import awsmobile from './aws-exports';
Amplify.configure(awsmobile);

import { API, graphqlOperation } from '@aws-amplify/api';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ListBooks, AddBook } from './src/components/graphql.js';
import ResourceGrid from './src/components/ResourceGrid.js' 


class App extends React.Component {
  state = {
    title: '',
    author: '',
    books: []
  }

  async componentDidMount() {
    try {
      const books = await API.graphql(graphqlOperation(ListBooks));
      console.log('books: ', books)
      this.setState({ books: books.data.listBooks.items });
    } catch(err) {
      console.log(err)
    }
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  addBook = async () => {
    if (this.state.title === '' || this.state.author === '') return;
    const book = { title: this.state.title, author: this.state.author };
    try {
      const books = [...this.state.books, book];
      this.setState({ books, title: '', author: '' })
      await API.graphql(graphqlOperation(AddBook, book));
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    return (
      <View>
        <ResourceGrid books={this.state.books} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 50
  },
  input: {
    height: 50,
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

export default withAuthenticator(App);

      /// <View style={styles.container}>
      //   <TextInput
      //     style={styles.input}
      //     value={this.state.title}
      //     onChangeText={val => this.onChangeText('title', val)}
      //     placeholder="What do you want to read?"
      //   />
      //   <TextInput
      //     style={styles.input}
      //     value={this.state.author}
      //     onChangeText={val => this.onChangeText('author', val)}
      //     placeholder="Who wrote it?"
      //   />
      //   <Button onPress={this.addBook} title="Add to TBR" color="#eeaa55" />
      //   {
      //     this.state.books.map((book, index) => {
      //       return ( 
      //         <View key={index} style={styles.book}>
      //           <Text style={styles.title}>{book.title}</Text>
      //           <Text style={styles.author}>{book.author}</Text>
      //         </View>
      //       )
      //     })
      //   }
      // </View>*/}