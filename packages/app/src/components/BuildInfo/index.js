// @flow
import type { BT$Build } from '@build-tracker/types';
import { BuildMeta } from '@build-tracker/builds';
import Link from '../Link';
import theme from '../../theme';
import { formatSha, formatTime } from '../../modules/formatting';
import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Table, Tbody, Td, Th, Tr } from '../Table';

type Props = {
  build: BT$Build
};

export default class BuildInfo extends PureComponent<Props> {
  render() {
    const { build } = this.props;
    const {
      meta: {
        timestamp, // eslint-disable-line
        ...otherMeta
      }
    } = build;
    return (
      <View>
        <Text style={styles.heading}>Build {formatSha(BuildMeta.getRevision(build))}</Text>
        <Table>
          <Tbody>
            <Tr>
              <Th>timestamp</Th>
              <Td>{formatTime(BuildMeta.getTimestamp(build))}</Td>
            </Tr>
            {Object.keys(otherMeta).length > 0
              ? Object.keys(otherMeta).map(key => {
                  const url = BuildMeta.getMetaUrl(otherMeta[key]);
                  const value = BuildMeta.getMetaValue(otherMeta[key]);
                  return (
                    <Tr key={key}>
                      <Th>{key}</Th>
                      <Td>{url ? <Link to={url}>{value}</Link> : value}</Td>
                    </Tr>
                  );
                })
              : null}
          </Tbody>
        </Table>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: theme.fontSizeXLarge
  },
  sectionHeading: {
    fontSize: theme.fontSizeLarge
  }
});
