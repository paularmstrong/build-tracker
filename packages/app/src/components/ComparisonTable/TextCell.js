// @flow
import * as React from 'react';
import styles from './styles';
import { Th } from '../Table';
import { Text, View } from 'react-native';

type Props = {
  hoverColor?: string,
  isHovered?: boolean,
  style?: mixed,
  text: string
};

export default class ArtifactCell extends React.PureComponent<Props> {
  render() {
    const { style, text } = this.props;
    return (
      <Th style={[styles.cell, styles.rowHeader, styles.stickyColumn, style]}>
        <View style={styles.cellContent}>
          <Text style={styles.cellValue}>{text}</Text>
        </View>
      </Th>
    );
  }
}
