import * as Selection from 'd3-selection';
import { act } from 'react-dom/test-utils';
import HoverOverlay from '../HoverOverlay';
import { mount } from 'enzyme';
import React from 'react';
import { scalePoint } from 'd3-scale';

const xScale = scalePoint()
  .range([0, 400])
  .domain(['1234567abcdef', 'abcdefg1234567', 'abcd', '1234']);

describe('HoverOverlay', () => {
  describe('default render', () => {
    test('does not display the line', () => {
      const wrapper = mount(
        <svg>
          <HoverOverlay height={400} width={400} xScale={xScale} />
        </svg>
      );
      expect(wrapper.find('line').prop('style')).toMatchObject({ opacity: 0 });
    });
  });

  describe('onMouseOver', () => {
    test('shows the line', () => {
      const mockStyle = jest.fn();
      // @ts-ignore
      jest.spyOn(Selection, 'select').mockReturnValue({ style: mockStyle });
      const wrapper = mount(
        <svg>
          <HoverOverlay height={400} width={400} xScale={xScale} />
        </svg>
      );
      act(() => {
        wrapper.find('rect').simulate('mouseover');
      });

      expect(mockStyle).toHaveBeenCalledWith('opacity', 1);
    });
  });

  describe('onMouseOut', () => {
    test('hides the line', () => {
      const mockStyle = jest.fn();
      // @ts-ignore
      jest.spyOn(Selection, 'select').mockReturnValue({ style: mockStyle });
      const wrapper = mount(
        <svg>
          <HoverOverlay height={400} width={400} xScale={xScale} />
        </svg>
      );
      act(() => {
        wrapper.find('rect').simulate('mouseover');
        wrapper.find('rect').simulate('mouseout');
      });

      expect(mockStyle).toHaveBeenCalledWith('opacity', 0);
    });
  });

  describe('onMouseMove', () => {
    test('moves the line', () => {
      const mockAttr = jest.fn(() => ({
        attr: mockAttr
      }));

      // @ts-ignore
      jest.spyOn(Selection, 'select').mockReturnValue({ attr: mockAttr });
      const wrapper = mount(
        <svg>
          <HoverOverlay height={400} width={400} xScale={xScale} />
        </svg>
      );
      act(() => {
        wrapper.find('rect').simulate('mousemove', { nativeEvent: { offsetX: 200 } });
      });

      expect(mockAttr).toHaveBeenCalledWith('y2', 400);
      expect(mockAttr).toHaveBeenCalledWith('y1', 0);

      // the second revision is at ~ 133px in a 400px wide area
      expect(mockAttr).toHaveBeenCalledWith('x2', 400 / 3);
      expect(mockAttr).toHaveBeenCalledWith('x1', 400 / 3);
    });
  });
});
