// @flow
import theme from '../theme';
import { Picker, StyleSheet, Text, View } from 'react-native';
import React, { PureComponent } from 'react';

type Props = {
  branches: Array<string>
};

type State = {
  baseBranch: string,
  compareBranch: string
};

export default class BranchPicker extends PureComponent<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = { baseBranch: props.branches[0], compareBranch: props.branches[0] };
  }

  render() {
    const { branches } = this.props;
    const { baseBranch, compareBranch } = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.branch}>
          <Text>Base Branch</Text>
          <Picker onValueChange={this._handleChangBaseBranch} selectedValue={baseBranch} style={styles.picker}>
            {branches.map((branch: string) => <Picker.Item key={branch} label={branch} />)}
          </Picker>
        </View>
        <View style={styles.branch}>
          <Text>Compare Branch</Text>
          <Picker onValueChange={this._handleChangCompareBranch} selectedValue={compareBranch} style={styles.picker}>
            {branches.map((branch: string) => <Picker.Item key={branch} label={branch} />)}
          </Picker>
        </View>
      </View>
    );
  }

  _handleChangBaseBranch = (value: string) => {
    this.setState({ baseBranch: value });
  };

  _handleChangCompareBranch = (value: string) => {
    this.setState({ compareBranch: value });
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
