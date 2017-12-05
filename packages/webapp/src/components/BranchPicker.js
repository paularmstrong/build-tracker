// @flow
import theme from '../theme';
import React, { PureComponent } from 'react';
import { createElement, StyleSheet, Text, View } from 'react-native';

// TODO: replace with RNW Picker/Picker.Item in > 0.1.16
const Picker = props => createElement('select', props);
const PickerItem = props => createElement('option', props);

type BranchPickerProps = {
  branches: Array<string>
};

export default class BranchPicker extends PureComponent<BranchPickerProps> {
  render() {
    const { branches } = this.props;
    return (
      <View style={styles.root}>
        <View style={styles.branch}>
          <Text>Base Branch</Text>
          <Picker style={styles.picker}>
            {branches.map((branch: string) => <PickerItem key={branch}>{branch}</PickerItem>)}
          </Picker>
        </View>
        <View style={styles.branch}>
          <Text>Compare Branch</Text>
          <Picker style={styles.picker}>
            {branches.map((branch: string) => <PickerItem key={branch}>{branch}</PickerItem>)}
          </Picker>
        </View>
      </View>
    );
  }
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
    color: 'rgb(161,161,161)',
    fontSize: theme.fontSizeNormal
  }
});
