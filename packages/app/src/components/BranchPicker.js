// @flow
import theme from '../theme';
import { Picker, StyleSheet, Text, View } from 'react-native';
import React, { PureComponent } from 'react';

type Props = {
  baseBranch: string,
  branches: Array<string>,
  compareBranch: string,
  onChangeBranches: (baseBranch: string, compareBranch: string) => void
};

type State = {
  baseBranch?: string,
  compareBranch?: string
};

export default class BranchPicker extends PureComponent<Props, State> {
  state = {};

  render() {
    const { branches, baseBranch, compareBranch } = this.props;
    return (
      <View style={styles.root}>
        <View style={styles.branch}>
          <Text>Base Branch</Text>
          <Picker
            onValueChange={this._handleChangBaseBranch}
            selectedValue={this.state.baseBranch || baseBranch}
            style={styles.picker}
          >
            {branches.map((branch: string) => <Picker.Item key={branch} label={branch} />)}
          </Picker>
        </View>
        <View style={styles.branch}>
          <Text>Compare Branch</Text>
          <Picker
            onValueChange={this._handleChangCompareBranch}
            selectedValue={this.state.compareBranch || compareBranch}
            style={styles.picker}
          >
            {branches.map((branch: string) => <Picker.Item key={branch} label={branch} />)}
          </Picker>
        </View>
      </View>
    );
  }

  _handleChangBaseBranch = (value: string) => {
    this.setState({ baseBranch: value }, this._handleChangeBranches);
  };

  _handleChangCompareBranch = (value: string) => {
    this.setState({ compareBranch: value }, this._handleChangeBranches);
  };

  _handleChangeBranches = () => {
    this.props.onChangeBranches(
      this.state.baseBranch || this.props.baseBranch,
      this.state.compareBranch || this.props.compareBranch
    );
  };
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row'
  },
  branch: {
    flexGrow: 1,
    marginHorizontal: theme.spaceMedium
  },
  picker: {
    borderWidth: 0,
    borderRadius: 2,
    backgroundColor: 'rgb(223,223,223)',
    color: 'rgb(161,161,161)'
  }
});
