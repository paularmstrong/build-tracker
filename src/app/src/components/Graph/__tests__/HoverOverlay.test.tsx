/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Selection from 'd3-selection';
import { act } from 'react-dom/test-utils';
import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import HoverOverlay from '../HoverOverlay';
import React from 'react';
import { stack } from 'd3-shape';
import { fireEvent, render } from 'react-testing-library';
import { scaleLinear, scalePoint } from 'd3-scale';

const xScale = scalePoint()
  .range([0, 300])
  .domain(['1234567abcdef', 'abcdefg1234567', 'abcd', '1234']);
const yScale = scaleLinear()
  .range([400, 0])
  .domain([0, 168]);
const builds = [
  new Build({ branch: 'master', revision: '1234567abcdef', parentRevision: '000', timestamp: 0 }, [
    { name: 'main', hash: '123', sizes: { gzip: 123 } },
    { name: 'vendor', hash: '123', sizes: { gzip: 45 } }
  ]),
  new Build({ branch: 'master', revision: 'abcdefg1234567', parentRevision: '123', timestamp: 1 }, [
    { name: 'main', hash: '123', sizes: { gzip: 123 } },
    { name: 'vendor', hash: '123', sizes: { gzip: 45 } }
  ]),
  new Build({ branch: 'master', revision: 'abcd', parentRevision: '123', timestamp: 2 }, [
    { name: 'main', hash: '123', sizes: { gzip: 123 } },
    { name: 'vendor', hash: '123', sizes: { gzip: 45 } }
  ]),
  new Build({ branch: 'master', revision: '1234', parentRevision: '123', timestamp: 3 }, [
    { name: 'main', hash: '123', sizes: { gzip: 123 } },
    { name: 'vendor', hash: '123', sizes: { gzip: 45 } }
  ])
];
const comparator = new Comparator({ builds });

const dataStack = stack<Build, string>();
dataStack.keys(['main', 'vendor']);
dataStack.value((build: Build, key) => {
  const artifact = build.getArtifact(key);
  return artifact ? artifact.sizes['gzip'] : 0;
});
const data = dataStack(comparator.builds);

describe('HoverOverlay', () => {
  describe('default render', () => {
    test('does not display the line', () => {
      const { getByTestId } = render(
        <svg>
          <HoverOverlay
            data={data}
            height={400}
            onHoverArtifacts={jest.fn()}
            onSelectRevision={jest.fn()}
            selectedRevisions={[]}
            width={300}
            xScale={xScale}
            yScale={yScale}
          />
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
          <HoverOverlay
            data={data}
            height={400}
            onHoverArtifacts={jest.fn()}
            onSelectRevision={jest.fn()}
            selectedRevisions={[]}
            width={300}
            xScale={xScale}
            yScale={yScale}
          />
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
          <HoverOverlay
            data={data}
            height={400}
            onHoverArtifacts={jest.fn()}
            onSelectRevision={jest.fn()}
            selectedRevisions={[]}
            width={300}
            xScale={xScale}
            yScale={yScale}
          />
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
    let mockD3Select;
    beforeEach(() => {
      mockD3Select = jest.fn(() => ({
        attr: mockD3Select,
        duration: mockD3Select,
        transition: mockD3Select
      }));
      // @ts-ignore
      jest.spyOn(Selection, 'select').mockReturnValue(mockD3Select());
    });

    test('moves the line', () => {
      const { getByTestId } = render(
        <svg>
          <HoverOverlay
            data={data}
            height={400}
            onHoverArtifacts={jest.fn()}
            onSelectRevision={jest.fn()}
            selectedRevisions={[]}
            width={300}
            xScale={xScale}
            yScale={yScale}
          />
        </svg>
      );
      act(() => {
        fireEvent.mouseMove(getByTestId('hoveroverlay'));
      });

      expect(mockD3Select).toHaveBeenCalledWith('x2', 300);
      expect(mockD3Select).toHaveBeenCalledWith('x1', 300);
    });

    test('calls back with the hovered artifact', () => {
      const handleHoverArtifacts = jest.fn();
      const { getByTestId } = render(
        <svg>
          <HoverOverlay
            data={data}
            height={400}
            onHoverArtifacts={handleHoverArtifacts}
            onSelectRevision={jest.fn()}
            selectedRevisions={[]}
            width={300}
            xScale={xScale}
            yScale={yScale}
          />
        </svg>
      );
      act(() => {
        fireEvent.mouseMove(getByTestId('hoveroverlay'));
      });

      expect(handleHoverArtifacts).toHaveBeenCalledWith(['vendor']);
    });

    test('calls back with null if no artifact', () => {
      const handleHoverArtifacts = jest.fn();
      const yScale = scaleLinear()
        .range([400, 0])
        .domain([0, 200]);
      const { getByTestId } = render(
        <svg>
          <HoverOverlay
            data={data}
            height={400}
            onHoverArtifacts={handleHoverArtifacts}
            onSelectRevision={jest.fn()}
            selectedRevisions={[]}
            width={300}
            xScale={xScale}
            yScale={yScale}
          />
        </svg>
      );
      act(() => {
        fireEvent.mouseMove(getByTestId('hoveroverlay'));
      });

      expect(handleHoverArtifacts).toHaveBeenCalledWith([]);
    });
  });

  describe('onSelectRevision', () => {
    test('passes the correct revision string', () => {
      const handleSelectRevision = jest.fn();
      const { getByTestId } = render(
        <svg>
          <HoverOverlay
            data={data}
            height={400}
            onHoverArtifacts={jest.fn()}
            onSelectRevision={handleSelectRevision}
            selectedRevisions={[]}
            width={300}
            xScale={xScale}
            yScale={yScale}
          />
        </svg>
      );
      act(() => {
        fireEvent.click(getByTestId('hoveroverlay'));
      });

      expect(handleSelectRevision).toHaveBeenCalledWith('1234');
    });

    test('does nothing when selecting a currently selected revision', () => {
      const handleSelectRevision = jest.fn();
      const { getByTestId } = render(
        <svg>
          <HoverOverlay
            data={data}
            height={400}
            onHoverArtifacts={jest.fn()}
            onSelectRevision={handleSelectRevision}
            selectedRevisions={['1234']}
            width={300}
            xScale={xScale}
            yScale={yScale}
          />
        </svg>
      );
      act(() => {
        fireEvent.click(getByTestId('hoveroverlay'));
      });

      expect(handleSelectRevision).not.toHaveBeenCalled();
    });

    test('draws a line for the selected revisions', () => {
      const { queryAllByTestId } = render(
        <svg>
          <HoverOverlay
            data={data}
            height={400}
            onHoverArtifacts={jest.fn()}
            onSelectRevision={jest.fn()}
            selectedRevisions={['abcdefg1234567', 'abcd']}
            width={300}
            xScale={xScale}
            yScale={yScale}
          />
        </svg>
      );

      expect(queryAllByTestId('selectedline')).toHaveLength(2);
      const line1 = queryAllByTestId('selectedline')[0];
      expect(line1.getAttribute('x1')).toBe('100');
      expect(line1.getAttribute('x2')).toBe('100');
      expect(line1.getAttribute('y1')).toBe('0');
      expect(line1.getAttribute('y2')).toBe('400');

      const line2 = queryAllByTestId('selectedline')[1];
      expect(line2.getAttribute('x1')).toBe('200');
      expect(line2.getAttribute('x2')).toBe('200');
      expect(line2.getAttribute('y1')).toBe('0');
      expect(line2.getAttribute('y2')).toBe('400');
    });
  });
});
