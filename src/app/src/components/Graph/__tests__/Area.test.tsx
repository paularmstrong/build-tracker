/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Area from '../Area';
import Build from '@build-tracker/build';
import ColorScale from '../../../modules/ColorScale';
import Comparator from '@build-tracker/comparator';
import React from 'react';
import { render } from 'react-testing-library';
import { stack } from 'd3-shape';
import { timerFlush } from 'd3-timer';
import { scaleLinear, scalePoint } from 'd3-scale';

describe('Area', () => {
  test('only draws the active artifacts', () => {
    const builds = [
      new Build({ revision: '123', parentRevision: '000', timestamp: 0 }, [
        { name: 'main', hash: '123', sizes: { gzip: 123 } },
        { name: 'vendor', hash: '123', sizes: { gzip: 123 } }
      ]),
      new Build({ revision: 'abc', parentRevision: '123', timestamp: 0 }, [
        { name: 'main', hash: '123', sizes: { gzip: 123 } },
        { name: 'vendor', hash: '123', sizes: { gzip: 123 } }
      ])
    ];
    const comparator = new Comparator({ builds });

    const dataStack = stack<Build, string>();
    dataStack.keys(['main']);
    dataStack.value((build: Build, key) => {
      const artifact = build.getArtifact(key);
      return artifact ? artifact.sizes['gzip'] : 0;
    });
    const data = dataStack(comparator.builds);

    const xScale = scalePoint()
      .range([0, 100])
      .domain(['123', 'abc']);
    const yScale = scaleLinear()
      .range([400, 0])
      .domain([0, 400]);
    const { getByLabelText } = render(
      <svg>
        <Area
          activeArtifactNames={['main']}
          colorScale={ColorScale.Rainbow}
          comparator={comparator}
          data={data}
          hoveredArtifact={null}
          xScale={xScale}
          yScale={yScale}
        />
      </svg>
    );
    timerFlush();
    const wrapper = getByLabelText('Stacked area chart for main');
    expect(wrapper.children).toHaveLength(1);
  });

  test('can render if an artifact does not exist in a build', () => {
    const builds = [
      new Build({ revision: '123', parentRevision: '000', timestamp: 0 }, [
        { name: 'main', hash: '123', sizes: { stat: 456 } }
      ]),
      new Build({ revision: 'abc', parentRevision: '123', timestamp: 0 }, [
        { name: 'main', hash: '123', sizes: { stat: 489 } },
        { name: 'vendor', hash: '123', sizes: { stat: 123 } }
      ])
    ];
    const comparator = new Comparator({ builds });

    const dataStack = stack<Build, string>();
    dataStack.keys(['main', 'vendor']);
    dataStack.value((build: Build, key) => {
      const artifact = build.getArtifact(key);
      return artifact ? artifact.sizes['stat'] : 0;
    });
    const data = dataStack(comparator.builds);

    const xScale = scalePoint()
      .range([0, 100])
      .domain(['123', 'abc']);
    const yScale = scaleLinear()
      .range([400, 0])
      .domain([0, 400]);
    const { getByLabelText } = render(
      <svg>
        <Area
          activeArtifactNames={['main', 'vendor']}
          colorScale={ColorScale.Rainbow}
          comparator={comparator}
          data={data}
          hoveredArtifact={null}
          xScale={xScale}
          yScale={yScale}
        />
      </svg>
    );
    timerFlush();
    const wrapper = getByLabelText('Stacked area chart for main, vendor');
    expect(wrapper.children).toHaveLength(2);
    expect(wrapper.children[0].nodeName).toEqual('path');
    expect(wrapper.children[1].nodeName).toEqual('path');
  });
});
