import ColorScale from '../../../modules/ColorScale';
import ColorScaleComponent from '../ColorScale';
import { ColorScalePicker } from '../';
import React from 'react';
import { shallow } from 'enzyme';

describe('ColorScalePicker', () => {
  test('passes onSelect through', () => {
    const handleSelect = jest.fn();
    const wrapper = shallow(<ColorScalePicker activeColorScale={ColorScale.Magma} onSelect={handleSelect} />);
    wrapper
      .find(ColorScaleComponent)
      .first()
      .simulate('select', ColorScale.Rainbow);
    expect(handleSelect).toHaveBeenCalledWith(ColorScale.Rainbow);
  });
});
