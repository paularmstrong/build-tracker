import Bundles from './Bundles';
import Home from './Home';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import React, { Component } from 'react';
import { View } from 'react-native';

const ViewAll = ({ match }) => (match ? <Link to="/">View All</Link> : null);

class App extends Component {
  render() {
    return (
      <Router>
        <View>
          <View>
            <Route children={ViewAll} exact path="/bundles/:bundle" />
            <Bundles />
          </View>
          <View>
            <Route exact path="/" component={Home} />
          </View>
        </View>
      </Router>
    );
  }
}

export default App;
