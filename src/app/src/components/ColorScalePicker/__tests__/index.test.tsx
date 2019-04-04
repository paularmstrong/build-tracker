/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ColorScalePicker } from '../';
import mockStore from '../../../store/mock';
import React from 'react';
import { render } from 'react-native-testing-library';
import { StoreContext } from 'redux-react-hook';

describe('ColorScalePicker', () => {
  test('sets the active scale to selected', () => {
    const { queryAllByProps } = render(
      <StoreContext.Provider value={mockStore({ colorScale: 'Magma' })}>
        <ColorScalePicker />
      </StoreContext.Provider>
    );
    const selected = queryAllByProps({ isSelected: true });
    expect(selected).toHaveLength(1);
    expect(selected[0].props.name).toBe('Magma');
  });
});
