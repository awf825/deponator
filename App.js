/*
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


import Amplify from 'aws-amplify'
import config from './src/aws-exports'
Amplify.configure(config)

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
