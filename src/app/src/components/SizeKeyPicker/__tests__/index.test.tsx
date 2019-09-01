/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Actions from '../../../store/actions';
import mockStore from '../../../store/mock';
import { Provider } from 'react-redux';
import React from 'react';
import SizeKeyPicker from '../';
import { fireEvent, render } from 'react-native-testing-library';

describe('SizeKeyPicker', () => {
  test('renders a button per key', () => {
    const { queryAllByProps } = render(
      <Provider store={mockStore({ sizeKey: 'foo' })}>
        <SizeKeyPicker keys={['foo', 'bar']} />
      </Provider>
    );
    expect(queryAllByProps({ isSelected: true, value: 'foo' })).toHaveLength(1);
    expect(queryAllByProps({ isSelected: false, value: 'bar' })).toHaveLength(1);
  });

  test('passes the onSelect handler', () => {
    const handleSelect = jest.spyOn(Actions, 'setSizeKey');
    const { queryAllByProps } = render(
      <Provider store={mockStore({ sizeKey: 'foo' })}>
        <SizeKeyPicker keys={['foo', 'bar', 'tacos']} />
      </Provider>
    );
    expect(queryAllByProps({ value: 'foo' })).toHaveLength(1);
    expect(queryAllByProps({ value: 'bar' })).toHaveLength(1);
    expect(queryAllByProps({ value: 'tacos' })).toHaveLength(1);
    fireEvent(queryAllByProps({ value: 'bar' })[0], 'select', 'foo');
    expect(handleSelect).toHaveBeenCalledWith('foo');
  });
});
