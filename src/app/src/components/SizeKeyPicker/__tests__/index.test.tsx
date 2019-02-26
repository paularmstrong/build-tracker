/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import SizeKeyPicker from '../';
import { fireEvent, render } from 'react-native-testing-library';

describe('SizeKeyPicker', () => {
  test('renders a button per key', () => {
    const { queryAllByProps } = render(<SizeKeyPicker keys={['foo', 'bar']} onSelect={jest.fn()} selected="foo" />);
    expect(queryAllByProps({ isSelected: true, value: 'foo' })).toHaveLength(1);
    expect(queryAllByProps({ isSelected: false, value: 'bar' })).toHaveLength(1);
  });

  test('passes the onSelect handler', () => {
    const handleSelect = jest.fn();
    const { queryAllByProps } = render(
      <SizeKeyPicker keys={['foo', 'bar', 'tacos']} onSelect={handleSelect} selected="foo" />
    );
    const buttons = queryAllByProps({ onSelect: handleSelect });
    expect(buttons).toHaveLength(4); // the root component counts as 1
    fireEvent(buttons[0], 'select', 'foo');
    expect(handleSelect).toHaveBeenCalledWith('foo');
  });
});
