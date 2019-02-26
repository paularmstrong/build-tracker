/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppRegistry } from 'react-native';
import Main from './screens/Main';

AppRegistry.registerComponent('App', () => Main);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root')
});
