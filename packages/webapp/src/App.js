import Bundles from './Bundles';
import Home from './Home';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from './theme';

const ViewAll = ({ match }) => (match ? <Link to="/">View All</Link> : null);

class App extends Component {
  render() {
    return (
      <Router>
        <View style={styles.root}>
          <View style={styles.nav}>
            <Route children={ViewAll} exact path="/bundles/:bundle" />
            <Bundles />
          </View>
          <View style={styles.main}>
            <Route exact path="/" component={Home} />
          </View>
        </View>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: '100%',
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0
  },
  nav: {
    flexGrow: 0,
    flexBasis: `${2 * (100 / theme.columns)}%`,
    overflowY: 'scroll'
  },
  main: {
    flexGrow: 1,
    height: '100%'
  }
});

export default App;
