/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Divider from '../Divider';
import React from 'react';
import { render } from '@testing-library/react';

describe('Divider', () => {
  test('renders a simple divider', () => {
    const { container } = render(<Divider />);
    // @ts-ignore
    expect(container.firstChild.style.backgroundColor).toEqual('rgb(212, 212, 212)');
  });

  test('renders a divider with the given color', () => {
    const { container } = render(<Divider color="red" />);
    // @ts-ignore
    expect(container.firstChild.style.backgroundColor).toEqual('rgb(255, 0, 0)');
  });
});
