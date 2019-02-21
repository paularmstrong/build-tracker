import React from 'react';
import { shallow } from 'enzyme';
import Subtitle from '../Subtitle';
import { Text } from 'react-native';

describe('Subtitle', () => {
  test('renders a subtitle', () => {
    const wrapper = shallow(<Subtitle title="Tacos" />);
    expect(
      wrapper
        .find(Text)
        .children()
        .text()
    ).toBe('Tacos');
  });
});
