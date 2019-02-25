import ColorScale from '../../../modules/ColorScale';
import ColorScaleComponent from '../ColorScale';
import { ColorScalePicker } from '../';
import React from 'react';
import { fireEvent, render } from 'react-native-testing-library';

describe('ColorScalePicker', () => {
  test('passes onSelect through', () => {
    const handleSelect = jest.fn();
    const { queryAllByType } = render(<ColorScalePicker activeColorScale={ColorScale.Magma} onSelect={handleSelect} />);
    fireEvent(queryAllByType(ColorScaleComponent)[0], 'select', ColorScale.Rainbow);
    expect(handleSelect).toHaveBeenCalledWith(ColorScale.Rainbow);
  });
});
