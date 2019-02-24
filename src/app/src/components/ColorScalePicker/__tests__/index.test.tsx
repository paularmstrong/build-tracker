import ColorScale from '../ColorScale';
import { ColorScalePicker } from '../';
import React from 'react';
import { scales } from '../../../context/ColorScale';
import { shallow } from 'enzyme';

describe('ColorScalePicker', () => {
  test('passes onSelect through', () => {
    const handleSelect = jest.fn();
    const wrapper = shallow(<ColorScalePicker onSelect={handleSelect} />);
    wrapper
      .find(ColorScale)
      .first()
      .simulate('select', scales.Rainbow);
    expect(handleSelect).toHaveBeenCalledWith(scales.Rainbow);
  });
});
