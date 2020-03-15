/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import { render } from '@testing-library/react';
import Tooltip from '../Tooltip';
import { Dimensions, MeasureOnSuccessCallback, View } from 'react-native';

describe('Tooltip', () => {
  test('renders a tooltip to a portal', () => {
    const portal = document.createElement('div');
    portal.setAttribute('id', 'tooltipPortal');
    document.body.appendChild(portal);

    jest.spyOn(View.prototype, 'measure').mockImplementation(
      (fn: MeasureOnSuccessCallback): void => {
        fn(0, 0, 45, 20, 0, 0);
      }
    );

    const { getByRole, queryAllByText } = render(<Tooltip left={20} top={100} text="foobar" />, {
      container: portal
    });

    expect(getByRole('tooltip').style).toMatchObject({
      top: '90px',
      left: '26px'
    });
    expect(queryAllByText('foobar')).toHaveLength(1);
    document.body.removeChild(portal);
  });

  test('renders directly without a portal available', () => {
    jest.spyOn(View.prototype, 'measure').mockImplementation(
      (fn: MeasureOnSuccessCallback): void => {
        fn(0, 0, 45, 20, 0, 0);
      }
    );

    const { getByRole, queryAllByText } = render(<Tooltip left={20} top={100} text="foobar" />);

    expect(getByRole('tooltip').style).toMatchObject({
      top: '90px',
      left: '26px'
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

      const { getByRole } = render(<Tooltip left={10} top={200} text="foobar" />);

      expect(getByRole('tooltip').style).toMatchObject({
        top: '185px',
        left: '16px'
      });
    });

    test('avoids the right edge', () => {
      jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 400, scale: 1, fontScale: 1 });
      jest.spyOn(View.prototype, 'measure').mockImplementation(
        (fn: MeasureOnSuccessCallback): void => {
          fn(0, 0, 45, 30, 0, 0);
        }
      );

      const { getByRole } = render(<Tooltip left={380} top={200} text="foobar" />);

      expect(getByRole('tooltip').style).toMatchObject({
        top: '185px',
        left: '329px'
      });
    });

    test('avoids the top edge', () => {
      jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 400, scale: 1, fontScale: 1 });
      jest.spyOn(View.prototype, 'measure').mockImplementation(
        (fn: MeasureOnSuccessCallback): void => {
          fn(0, 0, 45, 30, 0, 0);
        }
      );
      const { getByRole } = render(<Tooltip left={200} top={0} text="foobar" />);

      expect(getByRole('tooltip').style).toMatchObject({
        top: '36px',
        left: '177px'
      });
    });
  });
});
