/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Actions from '../../../store/actions';
import mockStore from '../../../store/mock';
import React from 'react';
import SizeKeyPicker from '../';
import { StoreContext } from 'redux-react-hook';
import { fireEvent, render } from 'react-native-testing-library';

describe('SizeKeyPicker', () => {
  test('renders a button per key', () => {
    const { queryAllByProps } = render(
      <StoreContext.Provider value={mockStore({ sizeKey: 'foo' })}>
        <SizeKeyPicker keys={['foo', 'bar']} />
      </StoreContext.Provider>
    );
    expect(queryAllByProps({ isSelected: true, value: 'foo' })).toHaveLength(1);
    expect(queryAllByProps({ isSelected: false, value: 'bar' })).toHaveLength(1);
  });

  test('passes the onSelect handler', () => {
    const handleSelect = jest.spyOn(Actions, 'setSizeKey');
    const { queryAllByProps } = render(
      <StoreContext.Provider value={mockStore({ sizeKey: 'foo' })}>
        <SizeKeyPicker keys={['foo', 'bar', 'tacos']} />
      </StoreContext.Provider>
    );
    expect(queryAllByProps({ value: 'foo' })).toHaveLength(1);
    expect(queryAllByProps({ value: 'bar' })).toHaveLength(1);
    expect(queryAllByProps({ value: 'tacos' })).toHaveLength(1);
    fireEvent(queryAllByProps({ value: 'bar' })[0], 'select', 'foo');
    expect(handleSelect).toHaveBeenCalledWith('foo');
  });
});
