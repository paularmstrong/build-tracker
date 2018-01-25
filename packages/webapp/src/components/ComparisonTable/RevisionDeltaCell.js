// @flow
import { formatSha } from '../../modules/formatting';
import styles from './styles';
import { Th } from '../Table';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

type Props = {
  againstRevision: string,
  deltaIndex: number,
  revision: string
};

export default class RevisionDeltaCell extends PureComponent<Props> {
  render() {
    const { againstRevision, deltaIndex, revision } = this.props;
    return (
      <Th
        style={[styles.cell, styles.header]}
        title={`Delta from ${formatSha(againstRevision)} to ${formatSha(revision)}`}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerSha}>{`𝚫${deltaIndex}`}</Text>
        </View>
      </Th>
    );
  }
}
