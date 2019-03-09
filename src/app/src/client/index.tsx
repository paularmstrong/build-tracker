/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppRegistry } from 'react-native';
import Main from '../screens/Main';
import ReactDOM from 'react-dom';

AppRegistry.registerComponent('App', () => Main);
// @ts-ignore
const { element } = AppRegistry.getApplication('App', { initialProps: {} });
ReactDOM.hydrate(element, document.getElementById('root'));
