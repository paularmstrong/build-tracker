/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import RelativeModal from '../RelativeModal';
import { Dimensions, MeasureOnSuccessCallback, Text, View } from 'react-native';
import { fireEvent, render } from 'react-testing-library';

describe('RelativeModal', () => {
  let viewRef;
  beforeEach(() => {
    viewRef = React.createRef();
    render(<View ref={viewRef} />);
  });

  test('renders in a portal', () => {
    const portal = document.createElement('div');
    portal.setAttribute('id', 'menuPortal');
    document.body.appendChild(portal);

    jest.spyOn(viewRef.current, 'measureInWindow').mockImplementation(
      (fn: (x: number, y: number, width: number, height: number) => void): void => {
        fn(20, 100, 40, 30);
      }
    );

    const { queryAllByText } = render(
      <RelativeModal relativeTo={viewRef}>
        <Text>tacos</Text>
      </RelativeModal>,
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

    const { queryAllByText } = render(
      <RelativeModal relativeTo={viewRef}>
        <Text>tacos</Text>
        <Text>burritos</Text>
      </RelativeModal>
    );

    expect(queryAllByText('tacos')).toHaveLength(1);
    expect(queryAllByText('burritos')).toHaveLength(1);
  });

  test('clicking outside calls dismiss', () => {
    const handleDismiss = jest.fn();
    const { getByTestId } = render(
      <RelativeModal onDismiss={handleDismiss} relativeTo={viewRef}>
        <Text>tacos</Text>
      </RelativeModal>
    );
    fireEvent.touchStart(getByTestId('overlay'));
    fireEvent.touchEnd(getByTestId('overlay'));
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
        <RelativeModal accessibilityRole="menu" onDismiss={jest.fn()} relativeTo={viewRef}>
          <Text>tacos</Text>
        </RelativeModal>
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
        <RelativeModal accessibilityRole="menu" onDismiss={jest.fn()} relativeTo={viewRef}>
          <Text>tacos</Text>
        </RelativeModal>
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
        <RelativeModal accessibilityRole="menu" onDismiss={jest.fn()} relativeTo={viewRef}>
          <Text>tacos</Text>
        </RelativeModal>
      );

      expect(getByRole('menu').style).toMatchObject({
        top: '360px',
        left: '200px'
      });
    });
  });
});
