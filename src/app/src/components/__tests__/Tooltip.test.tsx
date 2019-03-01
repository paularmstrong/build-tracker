/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import { render } from 'react-testing-library';
import Tooltip from '../Tooltip';
import { MeasureOnSuccessCallback, View } from 'react-native';

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
});
