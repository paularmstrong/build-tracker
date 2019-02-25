import AppBar from '../AppBar';
import Button from '../Button';
import MenuIcon from '../../icons/Menu';
import React from 'react';
import { render } from 'react-native-testing-library';
import { Text, View } from 'react-native';

describe('AppBar', () => {
  describe('rendering', () => {
    test('renders a blank bar', () => {
      const { getByType } = render(<AppBar />);
      expect(() => getByType(Text)).toThrow();
    });

    test('renders a basic bar with a title when given a string', () => {
      const { getByText } = render(<AppBar title="Tacos" />);
      expect(getByText('Tacos')).not.toBeUndefined();
    });

    test('renders a title as provided when given an element', () => {
      const title = <View testID="foo" />;
      const { getByTestId } = render(<AppBar title={title} />);
      expect(getByTestId('foo')).not.toBeUndefined();
    });

    test('renders a button when provided a navigationIcon', () => {
      const { getByType } = render(<AppBar navigationIcon={MenuIcon} />);
      // @ts-ignore ts-jest fails on this but not tsc ¯\_(ツ)_/¯
      const button = getByType(Button);
      expect(button.props).toEqual(expect.objectContaining({ color: 'primary', icon: MenuIcon, title: 'Menu' }));
    });

    test('renders action items', () => {
      const actionItems = [<View key="tacos" testID="tacos" />, <View key="burritos" testID="burritos" />];
      const { getByTestId } = render(<AppBar actionItems={actionItems} />);
      expect(getByTestId('tacos')).not.toBeUndefined();
      expect(getByTestId('burritos')).not.toBeUndefined();
    });
  });
});
