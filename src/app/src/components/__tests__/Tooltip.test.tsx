/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import { render } from 'react-testing-library';
import Tooltip from '../Tooltip';
import { Dimensions, MeasureOnSuccessCallback, View } from 'react-native';

describe('Tooltip', () => {
  let viewRef;
  beforeEach(() => {
    viewRef = React.createRef();
    render(<View ref={viewRef} />);
  });

  test('renders a tooltip to a portal', () => {
    const portal = document.createElement('div');
    portal.setAttribute('id', 'tooltipPortal');
    document.body.appendChild(portal);

    jest.spyOn(View.prototype, 'measure').mockImplementation(
      (fn: MeasureOnSuccessCallback): void => {
        fn(0, 0, 45, 20, 0, 0);
      }
    );
    jest.spyOn(viewRef.current, 'measureInWindow').mockImplementation(
      (fn: (x: number, y: number, width: number, height: number) => void): void => {
        fn(20, 100, 40, 30);
      }
    );

    const { getByRole, queryAllByText } = render(<Tooltip relativeTo={viewRef} text="foobar" />, {
      container: portal
    });

    expect(getByRole('tooltip').style).toMatchObject({
      top: '136px',
      left: '17.5px'
    });
    expect(queryAllByText('foobar')).toHaveLength(1);
  });

  test('renders directly without a portal available', () => {
    jest.spyOn(View.prototype, 'measure').mockImplementation(
      (fn: MeasureOnSuccessCallback): void => {
        fn(0, 0, 45, 20, 0, 0);
      }
    );
    jest.spyOn(viewRef.current, 'measureInWindow').mockImplementation(
      (fn: (x: number, y: number, width: number, height: number) => void): void => {
        fn(20, 100, 40, 30);
      }
    );

    const { getByRole, queryAllByText } = render(<Tooltip relativeTo={viewRef} text="foobar" />);

    expect(getByRole('tooltip').style).toMatchObject({
      top: '136px',
      left: '17.5px'
    });
    expect(queryAllByText('foobar')).toHaveLength(1);
  });

  describe('window edge avoidance', () => {
    test('avoids the left edge', () => {
      jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 400, scale: 1, fontScale: 1 });
      jest.spyOn(View.prototype, 'measure').mockImplementation(
        (fn: MeasureOnSuccessCallback): void => {
          fn(0, 0, 45, 30, 0, 0);
        }
      );
      jest.spyOn(viewRef.current, 'measureInWindow').mockImplementation(
        (fn: (x: number, y: number, width: number, height: number) => void): void => {
          fn(10, 200, 20, 10);
        }
      );

      const { getByRole } = render(<Tooltip relativeTo={viewRef} text="foobar" />);

      expect(getByRole('tooltip').style).toMatchObject({
        top: '190px',
        left: '36px'
      });
    });

    test('avoids the right edge', () => {
      jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 400, scale: 1, fontScale: 1 });
      jest.spyOn(View.prototype, 'measure').mockImplementation(
        (fn: MeasureOnSuccessCallback): void => {
          fn(0, 0, 45, 30, 0, 0);
        }
      );
      jest.spyOn(viewRef.current, 'measureInWindow').mockImplementation(
        (fn: (x: number, y: number, width: number, height: number) => void): void => {
          fn(380, 200, 50, 10);
        }
      );

      const { getByRole } = render(<Tooltip relativeTo={viewRef} text="foobar" />);

      expect(getByRole('tooltip').style).toMatchObject({
        top: '190px',
        left: '329px'
      });
    });

    test('avoids the bottom edge', () => {
      jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 400, scale: 1, fontScale: 1 });
      jest.spyOn(View.prototype, 'measure').mockImplementation(
        (fn: MeasureOnSuccessCallback): void => {
          fn(0, 0, 45, 30, 0, 0);
        }
      );
      jest.spyOn(viewRef.current, 'measureInWindow').mockImplementation(
        (fn: (x: number, y: number, width: number, height: number) => void): void => {
          fn(200, 380, 50, 10);
        }
      );

      const { getByRole } = render(<Tooltip relativeTo={viewRef} text="foobar" />);

      expect(getByRole('tooltip').style).toMatchObject({
        top: '344px',
        left: '202.5px'
      });
    });
  });
});
