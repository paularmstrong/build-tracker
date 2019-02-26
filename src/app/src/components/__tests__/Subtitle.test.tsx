/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import { render } from 'react-native-testing-library';
import Subtitle from '../Subtitle';

describe('Subtitle', () => {
  test('renders a subtitle', () => {
    const { getByText } = render(<Subtitle title="Tacos" />);
    expect(getByText('Tacos')).not.toBeUndefined();
  });
});
