// @flow
import * as React from 'react';
import { BuildMeta } from '@build-tracker/builds';
import theme from '../theme';
import { formatSha, formatTime } from '../modules/formatting';
import { StyleSheet, Text, View } from 'react-native';
import { Table, Tbody, Td, Th, Tr } from './Table';

type Props = {
  build: BT$Build
};

export default class BuildInfo extends React.PureComponent<Props> {
  render() {
    const { build } = this.props;
    const {
      meta: {
        branch, // eslint-disable-line
        revision, // eslint-disable-line
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
              <Th>Revision</Th>
              <Td>{BuildMeta.getRevision(build)}</Td>
            </Tr>
            <Tr>
              <Th>Build Time</Th>
              <Td>{formatTime(BuildMeta.getTimestamp(build))}</Td>
            </Tr>
            {Object.keys(otherMeta).length > 0
              ? Object.keys(otherMeta).map(key => (
                  <Tr key={key}>
                    <Th>{key}</Th>
                    <Td>{BuildMeta.getMetaValue(otherMeta[key])}</Td>
                  </Tr>
                ))
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
