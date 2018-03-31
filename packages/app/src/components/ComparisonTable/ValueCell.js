// @flow
import { bytesToKb } from '../../modules/formatting';
import styles from './styles';
import { Td } from '../Table';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

type Props = {
  hoverColor: string,
  isHovered: boolean,
  stat: number,
  gzip: number,
  style?: mixed,
  valueType: 'gzip' | 'stat'
};

export default class ValueCell extends PureComponent<Props> {
  render() {
    const { hoverColor, isHovered, style, valueType } = this.props;
    const value = this.props[valueType];
    return (
      <Td style={[styles.cell, isHovered && { backgroundColor: hoverColor }, style]}>
        <View style={styles.cellContent}>
          <Text style={styles.cellValue}>{value ? bytesToKb(value) : '-'}</Text>
        </View>
      </Td>
    );
  }
}
