/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Axes from 'd3-axis';
import * as Selection from 'd3-selection';
import React from 'react';
import { render } from 'react-testing-library';
import { scalePoint } from 'd3-scale';
import XAxis from '../XAxis';

const scale = scalePoint()
  .range([0, 100])
  .domain(['1234567abcdef', 'abcdefg1234567', 'abcd', '1234']);

describe('XAxis', () => {
  test('creates a bottom axis', () => {
    const mockCall = jest.fn(() => {
      selectSpy.mockRestore();
      return Selection.select(document.createElement('g'));
    });
    // @ts-ignore Just want to make sure call is called
    const selectSpy = jest.spyOn(Selection, 'select').mockReturnValue({ call: mockCall });

    render(
      <svg>
        <XAxis height={400} scale={scale} />
      </svg>
    );

    expect(mockCall).toHaveBeenCalled();
  });

  test('formats shas', () => {
    const mockTickFormat = jest.fn(() => {
      axisSpy.mockRestore();
      return Axes.axisBottom(scale);
    });
    // @ts-ignore
    const axisSpy = jest.spyOn(Axes, 'axisBottom').mockReturnValue({ tickFormat: mockTickFormat });

    render(
      <svg>
        <XAxis height={400} scale={scale} />
      </svg>
    );

    expect(mockTickFormat).toHaveBeenCalled();
    // @ts-ignore
    const formatter = mockTickFormat.mock.calls[0][0];
    // @ts-ignore
    expect(formatter('1234567abcdef')).toEqual('1234567');
  });
});
