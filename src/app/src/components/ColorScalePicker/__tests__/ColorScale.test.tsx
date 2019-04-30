/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Actions from '../../../store/actions';
import { ColorScale } from '../ColorScale';
import mockStore from '../../../store/mock';
import RadioSelect from '../../RadioSelect';
import React from 'react';
import { StoreContext } from 'redux-react-hook';
import { fireEvent, render } from 'react-native-testing-library';

describe('ColorScale', () => {
  describe('rendering', () => {
    test('wraps the radio in a label', () => {
      const { queryAllByProps } = render(
        <StoreContext.Provider value={mockStore()}>
          <ColorScale name="tacos" />
        </StoreContext.Provider>
      );
      expect(queryAllByProps({ accessibilityRole: 'label' })).toHaveLength(1);
    });
  });

  describe('isSelected', () => {
    test('sets checkbox value when true', () => {
      const { getByType } = render(
        <StoreContext.Provider value={mockStore()}>
          <ColorScale isSelected name="tacos" />
        </StoreContext.Provider>
      );
      expect(getByType(RadioSelect).props.value).toBe(true);
    });

    test('does not set checkbox value when false', () => {
      const { getByType } = render(
        <StoreContext.Provider value={mockStore()}>
          <ColorScale name="tacos" />
        </StoreContext.Provider>
      );
      expect(getByType(RadioSelect).props.value).toBeUndefined();
    });
  });

  describe('onSelect', () => {
    test('fires onSelect with the value', () => {
      const handleOnSelect = jest.spyOn(Actions, 'setColorScale');
      const { getByType } = render(
        <StoreContext.Provider value={mockStore()}>
          <ColorScale name="Rainbow" />
        </StoreContext.Provider>
      );
      fireEvent(getByType(RadioSelect), 'valueChange', true);
      expect(handleOnSelect).toHaveBeenCalledWith('Rainbow');
    });

    test('does not fire onSelect when value changes to false', () => {
      const handleOnSelect = jest.spyOn(Actions, 'setColorScale');
      const { getByType } = render(
        <StoreContext.Provider value={mockStore()}>
          <ColorScale name="tacos" />
        </StoreContext.Provider>
      );
      fireEvent(getByType(RadioSelect), 'valueChange', false);
      expect(handleOnSelect).not.toHaveBeenCalled();
    });
  });
});
