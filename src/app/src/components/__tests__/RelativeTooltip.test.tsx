/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import RelativeTooltip from '../RelativeTooltip';
import { render } from '@testing-library/react';
import { MeasureOnSuccessCallback, View } from 'react-native';

describe('RelativeTooltip', () => {
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
    jest.spyOn(View.prototype, 'measureInWindow').mockImplementation(
      (fn: (x: number, y: number, width: number, height: number) => void): void => {
        fn(20, 100, 40, 30);
      }
    );

    const { getByRole, queryAllByText } = render(<RelativeTooltip relativeTo={viewRef} text="foobar" />, {
      container: portal
    });

    expect(getByRole('tooltip').style).toMatchObject({
      top: '89px',
      left: '17px'
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

    jest.spyOn(View.prototype, 'measureInWindow').mockImplementation(
      (fn: (x: number, y: number, width: number, height: number) => void): void => {
        fn(20, 100, 40, 30);
      }
    );

    const { getByRole, queryAllByText } = render(<RelativeTooltip relativeTo={viewRef} text="foobar" />);

    expect(getByRole('tooltip').style).toMatchObject({
      top: '89px',
      left: '17px'
    });
    expect(queryAllByText('foobar')).toHaveLength(1);
  });
});
