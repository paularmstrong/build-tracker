/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Axes from 'd3-axis';
import * as Selection from 'd3-selection';
import React from 'react';
import { render } from '@testing-library/react';
import { scalePoint } from 'd3-scale';
import XAxis from '../XAxis';

describe('XAxis', () => {
  test('creates a bottom axis', () => {
    const scale = scalePoint()
      .range([0, 100])
      .domain(['1234567abcdef', 'abcdefg1234567', 'abcd', '1234']);
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
    const scale = scalePoint()
      .range([0, 100])
      .domain(['1234567abcdef', 'abcdefg1234567', 'abcd', '1234']);
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

  test('limits number of tick labels', () => {
    const domain = new Array(150).fill(0).map((_v, i) => `12345${i}`);
    const scale = scalePoint()
      .range([0, 100])
      .domain(domain);
    const mockTickFormat = jest.fn(() => {
      axisSpy.mockRestore();
      return Axes.axisBottom(scale);
    });
    // @ts-ignore Just want to make sure call is called
    const axisSpy = jest.spyOn(Axes, 'axisBottom').mockReturnValue({ tickFormat: mockTickFormat });

    render(
      <svg>
        <XAxis height={400} scale={scale} />
      </svg>
    );

    // @ts-ignore
    const formatter: (string, number) => string = mockTickFormat.mock.calls[0][0];

    expect(formatter('1234567abc', 0)).toEqual('1234567');
    expect(formatter('1234567abc', 1)).toEqual('');
    expect(formatter('1234567abc', 2)).toEqual('');
    expect(formatter('1234567abc', 3)).toEqual('');
    expect(formatter('1234567abc', 4)).toEqual('');
    expect(formatter('1234567abc', 5)).toEqual('');
    expect(formatter('1234567abc', 6)).toEqual('1234567');
  });
});
