// @flow
import { bytesToKb } from '../../modules/formatting';
import { interpolateHcl } from 'd3-interpolate';
import { rgb } from 'd3-color';
import { scaleLinear } from 'd3-scale';
import styles from './styles';
import { Td } from '../Table';
import { Text } from 'react-native';
import React, { PureComponent } from 'react';

type Props = {
  gzip: number,
  gzipPercent: number,
  hashChanged: boolean,
  stat: number,
  statPercent: number,
  valueType: 'gzip' | 'stat'
};

const greenScale = scaleLinear()
  .domain([1, 0])
  .interpolate(interpolateHcl)
  .range([rgb('#d0f8d7'), rgb('#55e86e')]);
const redScale = scaleLinear()
  .domain([1, 2])
  .interpolate(interpolateHcl)
  .range([rgb('#fde2e1'), rgb('#f7635b')]);

export default class DeltaCell extends PureComponent<Props> {
  render() {
    const { gzipPercent, valueType } = this.props;
    const value = this.props[valueType];
    const backgroundColor =
      gzipPercent > 1
        ? redScale(Math.max(Math.min(gzipPercent, 2), 1))
        : gzipPercent === 1 ? 'transparent' : greenScale(Math.max(Math.min(gzipPercent, 1), 0));
    return (
      <Td style={[styles.cell, backgroundColor && { backgroundColor }]}>
        <Text>{value ? bytesToKb(value) : '-'}</Text>
      </Td>
    );
  }
}