/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import React from 'react';
import { render } from 'react-testing-library';
import { View } from 'react-native';

describe('Menu', () => {
  let viewRef;
  beforeEach(() => {
    viewRef = React.createRef();
    render(<View ref={viewRef} />);
  });

  test('renders with menu accessibilityRole', () => {
    const { queryAllByRole } = render(
      <Menu relativeTo={viewRef}>
        <MenuItem label="foo" />
      </Menu>
    );
    expect(queryAllByRole('menu')).toHaveLength(1);
  });
});
