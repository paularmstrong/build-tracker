/**
 * Copyright (c) 2019 Paul Armstrong
 */
import AppBar from '../AppBar';
import Button from '../Button';
import Menu from '../Menu';
import MenuIcon from '../../icons/Menu';
import MenuItem from '../MenuItem';
import MoreIcon from '../../icons/More';
import React from 'react';
import { fireEvent, render } from 'react-native-testing-library';
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
      const button = getByType(Button);
      expect(button.props).toEqual(expect.objectContaining({ color: 'primary', icon: MenuIcon, title: 'Menu' }));
    });

    test('renders action items', () => {
      const actionItems = [<View key="tacos" testID="tacos" />, <View key="burritos" testID="burritos" />];
      const { getByTestId } = render(<AppBar actionItems={actionItems} />);
      expect(getByTestId('tacos')).not.toBeUndefined();
      expect(getByTestId('burritos')).not.toBeUndefined();
    });

    test('renders a button for overflow items', () => {
      const { getByType } = render(<AppBar overflowItems={<MenuItem key={0} label="tacos" />} />);
      expect(getByType(Button).props).toMatchObject({
        icon: MoreIcon,
        iconOnly: true,
        title: 'More actions'
      });
    });
  });

  describe('overflow items', () => {
    test('shows a menu on button press', () => {
      const { getByType, queryAllByProps } = render(<AppBar overflowItems={<MenuItem key={0} label="tacos" />} />);
      expect(queryAllByProps({ accessibilityRole: 'menu' })).toHaveLength(0);
      fireEvent.press(getByType(Button));
      expect(queryAllByProps({ accessibilityRole: 'menu' })).toHaveLength(2);
    });

    test('hides the menu on dismiss', () => {
      const { getByType, queryAllByProps } = render(<AppBar overflowItems={<MenuItem key={0} label="tacos" />} />);
      fireEvent.press(getByType(Button));
      expect(queryAllByProps({ accessibilityRole: 'menu' })).toHaveLength(2);
      fireEvent(getByType(Menu), 'dismiss');
      expect(queryAllByProps({ accessibilityRole: 'menu' })).toHaveLength(0);
    });

    test('does not re-show the menu when overflowItems changes', () => {
      const { getByType, queryAllByProps, update } = render(
        <AppBar overflowItems={<MenuItem key={0} label="tacos" />} />
      );
      fireEvent.press(getByType(Button));
      expect(queryAllByProps({ accessibilityRole: 'menu' })).toHaveLength(2);
      update(<AppBar overflowItems={null} />);
      expect(queryAllByProps({ accessibilityRole: 'menu' })).toHaveLength(0);
      update(<AppBar overflowItems={<MenuItem key={0} label="tacos" />} />);
      expect(queryAllByProps({ accessibilityRole: 'menu' })).toHaveLength(0);
    });
  });
});
