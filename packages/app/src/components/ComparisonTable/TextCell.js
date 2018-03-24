// @flow
import * as React from 'react';
import styles from './styles';
import { Text } from 'react-native';
import { Th } from '../Table';

type Props = {
  hoverColor?: string,
  isHovered?: boolean,
  text: string
};

export default class ArtifactCell extends React.PureComponent<Props> {
  render() {
    const { text } = this.props;
    return (
      <Th style={[styles.cell, styles.rowHeader, styles.stickyColumn]}>
        <Text>{text}</Text>
      </Th>
    );
  }
}
