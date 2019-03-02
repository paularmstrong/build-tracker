/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import React from 'react';
import { Dimensions, MeasureOnSuccessCallback, View } from 'react-native';
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

    const { queryAllByText } = render(
      <Menu relativeTo={viewRef}>
        <MenuItem label="tacos" />
      </Menu>,
      {
        container: portal
      }
    );

    expect(queryAllByText('tacos')).toHaveLength(1);
  });

  test('renders directly without a portal available', () => {
    jest.spyOn(viewRef.current, 'measureInWindow').mockImplementation(
      (fn: (x: number, y: number, width: number, height: number) => void): void => {
        fn(20, 100, 40, 30);
      }
    );

    const { queryAllByRole, queryAllByText } = render(
      <Menu relativeTo={viewRef}>
        <MenuItem label="tacos" />
        <MenuItem label="burritos" />
      </Menu>
    );

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

  describe('render position', () => {
    test('avoids right window edge', () => {
      jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 400, scale: 1, fontScale: 1 });
      jest.spyOn(View.prototype, 'measure').mockImplementation(
        (fn: MeasureOnSuccessCallback): void => {
          fn(0, 0, 50, 30, 0, 0);
        }
      );
      jest.spyOn(viewRef.current, 'measureInWindow').mockImplementation(
        (fn: (x: number, y: number, width: number, height: number) => void): void => {
          fn(380, 200, 50, 10);
        }
      );
      const { getByRole } = render(
        <Menu onDismiss={jest.fn()} relativeTo={viewRef}>
          <MenuItem label="tacos" />
        </Menu>
      );

      expect(getByRole('menu').style).toMatchObject({
        top: '210px',
        left: '350px'
      });
    });

    test('avoids left window edge', () => {
      jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 400, scale: 1, fontScale: 1 });
      jest.spyOn(View.prototype, 'measure').mockImplementation(
        (fn: MeasureOnSuccessCallback): void => {
          fn(0, 0, 45, 30, 0, 0);
        }
      );
      jest.spyOn(viewRef.current, 'measureInWindow').mockImplementation(
        (fn: (x: number, y: number, width: number, height: number) => void): void => {
          fn(-10, 200, 20, 10);
        }
      );
      const { getByRole } = render(
        <Menu onDismiss={jest.fn()} relativeTo={viewRef}>
          <MenuItem label="tacos" />
        </Menu>
      );

      expect(getByRole('menu').style).toMatchObject({
        top: '210px',
        left: '0px'
      });
    });

    test('avoids bottom window edge', () => {
      jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 400, scale: 1, fontScale: 1 });
      jest.spyOn(View.prototype, 'measure').mockImplementation(
        (fn: MeasureOnSuccessCallback): void => {
          fn(0, 0, 45, 30, 0, 0);
        }
      );
      jest.spyOn(viewRef.current, 'measureInWindow').mockImplementation(
        (fn: (x: number, y: number, width: number, height: number) => void): void => {
          fn(200, 390, 20, 10);
        }
      );
      const { getByRole } = render(
        <Menu onDismiss={jest.fn()} relativeTo={viewRef}>
          <MenuItem label="tacos" />
        </Menu>
      );

      expect(getByRole('menu').style).toMatchObject({
        top: '360px',
        left: '200px'
      });
    });
  });
});
