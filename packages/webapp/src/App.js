import Bundles from './Bundles';
import Home from './Home';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from './theme';

const ViewAll = ({ match }) => (match ? <Link to="/">View All</Link> : null);

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { date: null };
  }

  render() {
    const { commit } = this.state;
    return (
      <Router>
        <View style={styles.root}>
          <View style={styles.nav}>
            <Text role="heading">Bundles</Text>
            <Route children={ViewAll} exact path="/bundles/:bundle" />
            <Bundles commit={commit} />
          </View>
          <View style={styles.main}>
            <Route exact path="/" render={this._renderHome} />
            <Route path="/bundles/:bundleName" render={this._renderHome} />
          </View>
        </View>
      </Router>
    );
  }

  _renderHome = props => {
    return <Home {...props} onPickCommit={this._handlePickCommit} />;
  };

  _handlePickCommit = commit => {
    this.setState({ commit });
  };
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: '100vh',
    position: 'absolute',
    width: '100vw',
    top: 0,
    left: 0
  },
  nav: {
    flexGrow: 0,
    flexBasis: `${3 * (100 / theme.columns)}%`,
    overflowY: 'scroll'
  },
  main: {
    flexGrow: 1,
    height: '100vh'
  }
});

export default App;
