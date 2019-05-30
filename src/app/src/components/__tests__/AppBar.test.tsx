/**
 * Copyright (c) 2019 Paul Armstrong
 */
import AppBar from '../AppBar';
import MenuIcon from '../../icons/Menu';
import MenuItem from '../MenuItem';
import React from 'react';
import { View } from 'react-native';
import { fireEvent, render } from '@testing-library/react';

describe('AppBar', () => {
  describe('rendering', () => {
    test('renders a blank bar', () => {
      const { getByText } = render(<AppBar />);
      expect(() => getByText(/.*/)).toThrow();
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

    test('renders a button without text when provided a navigationIcon', () => {
      const { queryAllByRole, queryAllByText } = render(<AppBar navigationIcon={MenuIcon} />);
      expect(queryAllByRole('button')).toHaveLength(1);
      expect(queryAllByText('Menu')).toHaveLength(0);
    });

    test('renders action items', () => {
      const actionItems = [<View key="tacos" testID="tacos" />, <View key="burritos" testID="burritos" />];
      const { getByTestId } = render(<AppBar actionItems={actionItems} />);
      expect(getByTestId('tacos')).not.toBeUndefined();
      expect(getByTestId('burritos')).not.toBeUndefined();
    });

    test('renders a button for overflow items', () => {
      const { queryAllByRole } = render(<AppBar overflowItems={<MenuItem key={0} label="tacos" />} />);
      expect(queryAllByRole('button')).toHaveLength(1);
    });
  });

  describe('overflow items', () => {
    test('shows a menu on button press', () => {
      const { getByRole, queryAllByRole } = render(<AppBar overflowItems={<MenuItem key={0} label="tacos" />} />);
      expect(queryAllByRole('menu')).toHaveLength(0);
      fireEvent.touchStart(getByRole('button'));
      fireEvent.touchEnd(getByRole('button'));
      expect(queryAllByRole('menu')).toHaveLength(1);
    });

    test('hides the menu on dismiss', () => {
      const { getByRole, getByTestId, queryAllByRole } = render(
        <AppBar overflowItems={<MenuItem key={0} label="tacos" />} />
      );
      fireEvent.touchStart(getByRole('button'));
      fireEvent.touchEnd(getByRole('button'));
      expect(queryAllByRole('menu')).toHaveLength(1);
      fireEvent.touchStart(getByTestId('overlay'));
      fireEvent.touchEnd(getByTestId('overlay'));
      expect(queryAllByRole('menu')).toHaveLength(0);
    });

    test('does not re-show the menu when overflowItems changes', () => {
      const { getByRole, queryAllByRole, rerender } = render(
        <AppBar overflowItems={<MenuItem key={0} label="tacos" />} />
      );
      fireEvent.touchStart(getByRole('button'));
      fireEvent.touchEnd(getByRole('button'));
      expect(queryAllByRole('menu')).toHaveLength(1);
      rerender(<AppBar overflowItems={null} />);
      expect(queryAllByRole('menu')).toHaveLength(0);
      rerender(<AppBar overflowItems={<MenuItem key={0} label="tacos" />} />);
      expect(queryAllByRole('menu')).toHaveLength(0);
    });
  });
});
