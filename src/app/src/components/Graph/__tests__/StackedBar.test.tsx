/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import ColorScale from '../../../modules/ColorScale';
import Comparator from '@build-tracker/comparator';
import React from 'react';
import { render } from '@testing-library/react';
import { stack } from 'd3-shape';
import StackedBar from '../StackedBar';
import { timerFlush } from 'd3-timer';
import { scaleBand, scaleLinear } from 'd3-scale';

describe('StackedBar', () => {
  test('only draws the active artifacts', () => {
    const builds = [
      new Build({ branch: 'master', revision: '123', parentRevision: '000', timestamp: 0 }, [
        { name: 'main', hash: '123', sizes: { gzip: 123 } },
        { name: 'vendor', hash: '123', sizes: { gzip: 123 } },
      ]),
      new Build({ branch: 'master', revision: 'abc', parentRevision: '123', timestamp: 0 }, [
        { name: 'main', hash: '123', sizes: { gzip: 123 } },
        { name: 'vendor', hash: '123', sizes: { gzip: 123 } },
      ]),
    ];
    const comparator = new Comparator({ builds });

    const dataStack = stack<Build, string>();
    dataStack.keys(['main']);
    dataStack.value((build: Build, key) => {
      const artifact = build.getArtifact(key);
      return artifact ? artifact.sizes['gzip'] : 0;
    });
    const data = dataStack(comparator.builds);

    const xScale = scaleBand().rangeRound([0, 100]).domain(['123', 'abc']);
    const yScale = scaleLinear().range([400, 0]).domain([0, 400]);
    const { getByLabelText } = render(
      <svg>
        <StackedBar
          activeArtifactNames={['main']}
          artifactNames={comparator.artifactNames}
          colorScale={ColorScale.Cool}
          data={data}
          height={400}
          hoveredArtifacts={[]}
          xScale={xScale}
          yScale={yScale}
        />
      </svg>
    );
    timerFlush();
    const wrapper = getByLabelText('Stacked bar chart for main');
    expect(wrapper.children).toHaveLength(1);
    expect(getByLabelText('main').getAttribute('style')).toEqual('fill: rgb(110, 64, 170);');
  });

  test('can render if an artifact does not exist in a build', () => {
    const builds = [
      new Build({ branch: 'master', revision: '123', parentRevision: '000', timestamp: 0 }, [
        { name: 'main', hash: '123', sizes: { stat: 456 } },
      ]),
      new Build({ branch: 'master', revision: 'abc', parentRevision: '123', timestamp: 0 }, [
        { name: 'main', hash: '123', sizes: { stat: 489 } },
        { name: 'vendor', hash: '123', sizes: { stat: 123 } },
      ]),
    ];
    const comparator = new Comparator({ builds });

    const dataStack = stack<Build, string>();
    dataStack.keys(['main', 'vendor']);
    dataStack.value((build: Build, key) => {
      const artifact = build.getArtifact(key);
      return artifact ? artifact.sizes['stat'] : 0;
    });
    const data = dataStack(comparator.builds);

    const xScale = scaleBand().rangeRound([0, 100]).domain(['123', 'abc']);
    const yScale = scaleLinear().range([400, 0]).domain([0, 400]);
    const { getByLabelText } = render(
      <svg>
        <StackedBar
          activeArtifactNames={['main', 'vendor']}
          artifactNames={comparator.artifactNames}
          colorScale={ColorScale.Cool}
          data={data}
          height={400}
          hoveredArtifacts={[]}
          xScale={xScale}
          yScale={yScale}
        />
      </svg>
    );
    timerFlush();
    const wrapper = getByLabelText('Stacked bar chart for main, vendor');
    expect(wrapper.children).toHaveLength(2);
    expect(wrapper.children[0].nodeName).toEqual('g');
    expect(wrapper.children[1].nodeName).toEqual('g');
    expect(getByLabelText('vendor').getAttribute('style')).toEqual('fill: rgb(175, 240, 91);');
    expect(getByLabelText('main').getAttribute('style')).toEqual('fill: rgb(110, 64, 170);');
  });

  test('reduces luminance of non-hovered artifacts', () => {
    const builds = [
      new Build({ branch: 'master', revision: '123', parentRevision: '000', timestamp: 0 }, [
        { name: 'main', hash: '123', sizes: { stat: 456 } },
        { name: 'vendor', hash: '123', sizes: { stat: 123 } },
      ]),
      new Build({ branch: 'master', revision: 'abc', parentRevision: '123', timestamp: 0 }, [
        { name: 'main', hash: '123', sizes: { stat: 489 } },
        { name: 'vendor', hash: '123', sizes: { stat: 123 } },
      ]),
    ];
    const comparator = new Comparator({ builds });

    const dataStack = stack<Build, string>();
    dataStack.keys(['main', 'vendor']);
    dataStack.value((build: Build, key) => {
      const artifact = build.getArtifact(key);
      return artifact ? artifact.sizes['gzip'] : 0;
    });
    const data = dataStack(comparator.builds);

    const xScale = scaleBand().rangeRound([0, 100]).domain(['123', 'abc']);
    const yScale = scaleLinear().range([400, 0]).domain([0, 400]);
    const { getByLabelText } = render(
      <svg>
        <StackedBar
          activeArtifactNames={['main', 'vendor']}
          artifactNames={comparator.artifactNames}
          colorScale={ColorScale.Cool}
          data={data}
          height={400}
          hoveredArtifacts={['vendor']}
          xScale={xScale}
          yScale={yScale}
        />
      </svg>
    );
    timerFlush();

    expect(getByLabelText('main').getAttribute('style')).toEqual('fill: rgb(188, 166, 217);');
    expect(getByLabelText('vendor').getAttribute('style')).toEqual('fill: rgb(175, 240, 91);');
  });
});
