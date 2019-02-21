import * as Theme from '../../theme';
import Divider from '../Divider';
import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheet, View } from 'react-native';

describe('Divider', () => {
  test('renders a simple divider', () => {
    const wrapper = shallow(<Divider />);
    expect(wrapper.find(View).exists()).toBe(true);
    expect(StyleSheet.flatten(wrapper.find(View).prop('style'))).toMatchObject({ backgroundColor: Theme.Color.Gray30 });
  });

  test('renders a divider with the given color', () => {
    const wrapper = shallow(<Divider color="red" />);
    expect(wrapper.find(View).exists()).toBe(true);
    expect(StyleSheet.flatten(wrapper.find(View).prop('style'))).toMatchObject({ backgroundColor: 'red' });
  });
});
