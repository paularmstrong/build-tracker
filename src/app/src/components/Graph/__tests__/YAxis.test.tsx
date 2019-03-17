/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Axes from 'd3-axis';
import * as Selection from 'd3-selection';
import React from 'react';
import { render } from 'react-testing-library';
import { scaleLinear } from 'd3-scale';
import YAxis from '../YAxis';

const scale = scaleLinear()
  .range([100, 0])
  .domain([0, 100]);

describe('YAxis', () => {
  let mockCall, selectSpy;
  beforeEach(() => {
    mockCall = jest.fn();
    // @ts-ignore Just want to make sure call is called
    selectSpy = jest.spyOn(Selection, 'select').mockReturnValue({ call: mockCall });
  });

  test('creates a left axis', () => {
    render(
      <svg>
        <YAxis scale={scale} />
      </svg>
    );

    expect(selectSpy).toHaveBeenCalled();
    expect(mockCall).toHaveBeenCalled();
  });

  test('rounds ticks', () => {
    const mockTickFormat = jest.fn(() => '1');
    // @ts-ignore
    jest.spyOn(Axes, 'axisLeft').mockReturnValue({ tickFormat: mockTickFormat });

    render(
      <svg>
        <YAxis scale={scale} />
      </svg>
    );

    // @ts-ignore
    const formatter = mockTickFormat.mock.calls[0][0];
    // @ts-ignore
    expect(formatter(1234)).toEqual('1 KiB');
  });
});
