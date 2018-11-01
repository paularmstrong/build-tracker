// @flow
import { bytesToKb } from '../../modules/formatting';
import { interpolateHcl } from 'd3-interpolate';
import { rgb } from 'd3-color';
import { scaleLinear } from 'd3-scale';
import styles from './styles';
import { Td } from '../Table';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

type Props = {
  gzip: number,
  gzipPercent: number,
  hashChanged: boolean,
  stat: number,
  statPercent: number,
  style?: mixed,
  valueType: 'gzip' | 'stat'
};

const greenScale = scaleLinear()
  .domain([-1, 0])
  .interpolate(interpolateHcl)
  .range([rgb('#d0f8d7'), rgb('#55e86e')]);
const redScale = scaleLinear()
  .domain([1, 0])
  .interpolate(interpolateHcl)
  .range([rgb('#fde2e1'), rgb('#f7635b')]);

export default class DeltaCell extends PureComponent<Props> {
  render() {
    const { gzipPercent, hashChanged, statPercent, style, valueType } = this.props;
    const value = this.props[valueType];
    const backgroundColor =
      gzipPercent > 0
        ? redScale(gzipPercent)
        : gzipPercent === 0 ? (hashChanged ? '#fff9d6' : 'transparent') : greenScale(gzipPercent);
    const percentChange = (valueType === 'gzip' ? gzipPercent : statPercent) * 100;
    return (
      <Td
        style={[styles.cell, backgroundColor && { backgroundColor }, style]}
        title={`${percentChange.toFixed(3)}% ${hashChanged ? ' - Hash Changed' : ''}`}
      >
        <View style={styles.cellContent}>
          <Text style={styles.cellValue}>{value ? bytesToKb(value) : hashChanged ? '⚠️' : '-'}</Text>
        </View>
      </Td>
    );
  }
}
