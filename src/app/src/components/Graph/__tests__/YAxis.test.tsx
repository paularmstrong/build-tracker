import * as Axes from 'd3-axis';
import * as Selection from 'd3-selection';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import React from 'react';
import { scaleLinear } from 'd3-scale';
import YAxis from '../YAxis';

const scale = scaleLinear()
  .range([100, 0])
  .domain([0, 100]);

describe('YAxis', () => {
  test('creates a left axis', () => {
    const mockCall = jest.fn();
    // @ts-ignore Just want to make sure call is called
    const selectSpy = jest.spyOn(Selection, 'select').mockReturnValue({ call: mockCall });

    const wrapper = mount(
      <svg>
        <YAxis scale={scale} />
      </svg>
    );
    act(() => {
      wrapper.update();
    });
    expect(selectSpy).toHaveBeenCalled();
    expect(mockCall).toHaveBeenCalled();
  });

  test('rounds ticks', () => {
    const mockTickFormat = jest.fn(() => '1');
    // @ts-ignore
    jest.spyOn(Axes, 'axisLeft').mockReturnValue({ tickFormat: mockTickFormat });

    const wrapper = mount(
      <svg>
        <YAxis scale={scale} />
      </svg>
    );
    act(() => {
      wrapper.update();
    });
    // @ts-ignore
    const formatter = mockTickFormat.mock.calls[0][0];
    // @ts-ignore
    expect(formatter(1234)).toEqual('1 KiB');
  });
});
