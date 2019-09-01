/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ColorScalePicker } from '../';
import mockStore from '../../../store/mock';
import { Provider } from 'react-redux';
import React from 'react';
import { render } from 'react-native-testing-library';

describe('ColorScalePicker', () => {
  test('sets the active scale to selected', () => {
    const { queryAllByProps } = render(
      <Provider store={mockStore({ colorScale: 'Magma' })}>
        <ColorScalePicker />
      </Provider>
    );
    const selected = queryAllByProps({ isSelected: true });
    expect(selected).toHaveLength(1);
    expect(selected[0].props.name).toBe('Magma');
  });
});
