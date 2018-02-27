// @flow
import { bytesToKb } from '../../modules/formatting';
import styles from './styles';
import { Td } from '../Table';
import { Text } from 'react-native';
import React, { PureComponent } from 'react';

type Props = {
  stat: number,
  gzip: number,
  valueType: 'gzip' | 'stat'
};

export default class ValueCell extends PureComponent<Props> {
  render() {
    const { valueType } = this.props;
    const value = this.props[valueType];
    return (
      <Td style={[styles.cell]}>
        <Text>{value ? bytesToKb(value) : '-'}</Text>
      </Td>
    );
  }
}
