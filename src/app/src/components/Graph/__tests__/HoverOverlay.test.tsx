/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Selection from 'd3-selection';
import { act } from 'react-dom/test-utils';
import HoverOverlay from '../HoverOverlay';
import React from 'react';
import { scalePoint } from 'd3-scale';
import { fireEvent, render } from 'react-testing-library';

const xScale = scalePoint()
  .range([0, 400])
  .domain(['1234567abcdef', 'abcdefg1234567', 'abcd', '1234']);

describe('HoverOverlay', () => {
  describe('default render', () => {
    test('does not display the line', () => {
      const { getByTestId } = render(
        <svg>
          <HoverOverlay height={400} onSelectRevision={jest.fn()} width={400} xScale={xScale} />
        </svg>
      );
      expect(getByTestId('hoverline').style).toMatchObject({ opacity: '0' });
    });
  });

  describe('onMouseOver', () => {
    test('shows the line', () => {
      const mockStyle = jest.fn();
      // @ts-ignore
      jest.spyOn(Selection, 'select').mockReturnValue({ style: mockStyle });
      const { getByTestId } = render(
        <svg>
          <HoverOverlay height={400} onSelectRevision={jest.fn()} width={400} xScale={xScale} />
        </svg>
      );
      act(() => {
        fireEvent.mouseOver(getByTestId('hoveroverlay'));
      });

      expect(mockStyle).toHaveBeenCalledWith('opacity', 1);
    });
  });

  describe('onMouseOut', () => {
    test('hides the line', () => {
      const mockStyle = jest.fn();
      // @ts-ignore
      jest.spyOn(Selection, 'select').mockReturnValue({ style: mockStyle });
      const { getByTestId } = render(
        <svg>
          <HoverOverlay height={400} onSelectRevision={jest.fn()} width={400} xScale={xScale} />
        </svg>
      );
      act(() => {
        fireEvent.mouseOver(getByTestId('hoveroverlay'));
        fireEvent.mouseOut(getByTestId('hoveroverlay'));
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
      const { getByTestId } = render(
        <svg>
          <HoverOverlay height={400} onSelectRevision={jest.fn()} width={400} xScale={xScale} />
        </svg>
      );
      act(() => {
        fireEvent.mouseMove(getByTestId('hoveroverlay'));
      });

      expect(mockAttr).toHaveBeenCalledWith('y2', 400);
      expect(mockAttr).toHaveBeenCalledWith('y1', 0);
      expect(mockAttr).toHaveBeenCalledWith('x2', 400);
      expect(mockAttr).toHaveBeenCalledWith('x1', 400);
    });
  });

  describe('onSelectRevision', () => {
    test('passes the correct revision string', () => {
      const handleSelectRevision = jest.fn();
      const { getByTestId } = render(
        <svg>
          <HoverOverlay height={400} onSelectRevision={handleSelectRevision} width={400} xScale={xScale} />
        </svg>
      );
      act(() => {
        fireEvent.click(getByTestId('hoveroverlay'));
      });

      expect(handleSelectRevision).toHaveBeenCalledWith('1234');
    });
  });
});
