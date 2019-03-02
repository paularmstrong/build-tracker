/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import React from 'react';
import { View } from 'react-native';
import { fireEvent, render } from 'react-testing-library';

describe('Menu', () => {
  let viewRef;
  beforeEach(() => {
    viewRef = React.createRef();
    render(<View ref={viewRef} />);
  });

  test('renders a menu in a portal', () => {
    const portal = document.createElement('div');
    portal.setAttribute('id', 'menuPortal');
    document.body.appendChild(portal);

    jest.spyOn(viewRef.current, 'measureInWindow').mockImplementation(
      (fn: (x: number, y: number, width: number, height: number) => void): void => {
        fn(20, 100, 40, 30);
      }
    );

    const { getByRole, queryAllByText } = render(
      <Menu relativeTo={viewRef}>
        <MenuItem label="tacos" />
      </Menu>,
      {
        container: portal
      }
    );

    expect(getByRole('menu').style).toMatchObject({
      top: '130px',
      left: '20px'
    });
    expect(queryAllByText('tacos')).toHaveLength(1);
  });

  test('renders directly without a portal available', () => {
    jest.spyOn(viewRef.current, 'measureInWindow').mockImplementation(
      (fn: (x: number, y: number, width: number, height: number) => void): void => {
        fn(20, 100, 40, 30);
      }
    );

    const { getByRole, queryAllByRole, queryAllByText } = render(
      <Menu relativeTo={viewRef}>
        <MenuItem label="tacos" />
        <MenuItem label="burritos" />
      </Menu>
    );

    expect(getByRole('menu').style).toMatchObject({
      top: '130px',
      left: '20px'
    });
    expect(queryAllByText('tacos')).toHaveLength(1);
    expect(queryAllByText('burritos')).toHaveLength(1);
    expect(queryAllByRole('menuitem')).toHaveLength(2);
  });

  test('clicking outside calls dismiss', () => {
    const handleDismiss = jest.fn();
    const { unmount } = render(
      <Menu onDismiss={handleDismiss} relativeTo={viewRef}>
        <MenuItem label="tacos" />
      </Menu>
    );
    fireEvent.click(document.body);
    expect(handleDismiss).toHaveBeenCalledTimes(1);

    unmount();
    fireEvent.click(document.body);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
