import { act } from 'react-dom/test-utils';
import Build from '@build-tracker/build';
import buildDataA from '@build-tracker/fixtures/builds/30af629d1d4c9f2f199cec5f572a019d4198004c.json';
import buildDataB from '@build-tracker/fixtures/builds/22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04.json';
import buildDataC from '@build-tracker/fixtures/builds/243024909db66ac3c3e48d2ffe4015f049609834.json';
import ColorScale from '../../../modules/ColorScale';
import Comparator from '@build-tracker/comparator';
import Graph from '../';
import { mount } from 'enzyme';
import React from 'react';
import { View } from 'react-native';

const builds = [
  new Build(buildDataA.meta, buildDataA.artifacts),
  new Build(buildDataB.meta, buildDataB.artifacts),
  new Build(buildDataC.meta, buildDataC.artifacts)
];

describe('Graph', () => {
  test('resizes the SVG after layout', () => {
    const comparator = new Comparator({ builds: builds });
    const wrapper = mount(
      <Graph activeArtifacts={{ main: true }} colorScale={ColorScale.Magma} comparator={comparator} sizeKey="stat" />
    );
    act(() => {
      wrapper.find(View).prop('onLayout')({ nativeEvent: { layout: { width: 400, height: 300 } } });
    });
    wrapper.update();
    const svg = wrapper.find('svg');
    expect(svg.prop('width')).toEqual(400);
    expect(svg.prop('height')).toEqual(300);
  });
});
