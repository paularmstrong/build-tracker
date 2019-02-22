import Build from '@build-tracker/build';
import buildDataA from '@build-tracker/fixtures/builds/30af629d1d4c9f2f199cec5f572a019d4198004c.json';
import buildDataB from '@build-tracker/fixtures/builds/22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04.json';
import buildDataC from '@build-tracker/fixtures/builds/243024909db66ac3c3e48d2ffe4015f049609834.json';
import Comparator from '@build-tracker/comparator';
import ComparisonTable from '../ComparisonTable';
import React from 'react';
import { shallow } from 'enzyme';
import { Table } from '../Table';

const builds = [
  new Build(buildDataA.meta, buildDataA.artifacts),
  new Build(buildDataB.meta, buildDataB.artifacts),
  new Build(buildDataC.meta, buildDataC.artifacts)
];

describe('ComparisonTable', () => {
  test('renders a table', () => {
    const comparator = new Comparator({ builds });
    const wrapper = shallow(<ComparisonTable comparator={comparator} sizeKey="stat" />);
    expect(wrapper.find(Table).exists()).toBe(true);
  });
});
