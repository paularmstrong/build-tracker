import React from 'react';
import ReactDOM from 'react-dom';
import { Text, View } from 'react-native';

const App = (): React.ReactElement => (
  <View>
    <Text>Build Tracker</Text>
  </View>
);

ReactDOM.render(<App />, document.getElementById('root'));
