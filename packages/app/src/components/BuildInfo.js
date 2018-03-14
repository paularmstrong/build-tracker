// @flow
import * as React from 'react';
import theme from '../theme';
import { formatSha, formatTime } from '../modules/formatting';
import { StyleSheet, Text, View } from 'react-native';
import { Table, Tbody, Td, Th, Tr } from './Table';

type Props = {
  build: BT$Build
};

export default class BuildInfo extends React.PureComponent<Props> {
  render() {
    const { build: { meta: { revision, timestamp, ...otherMeta } } } = this.props;
    return (
      <View>
        <Text style={styles.heading}>Build {formatSha(revision)}</Text>
        <Table>
          <Tbody>
            <Tr>
              <Th>Revision</Th>
              <Td>{revision}</Td>
            </Tr>
            <Tr>
              <Th>Build Time</Th>
              <Td>{formatTime(timestamp)}</Td>
            </Tr>
          </Tbody>
        </Table>
        {Object.keys(otherMeta).length > 0 ? (
          <View>
            <Text style={styles.sectionHeading}>Build Meta</Text>
            <Table>
              <Tbody>
                {Object.keys(otherMeta).map(key => (
                  <Tr>
                    <Th>{key}</Th>
                    <Td>{otherMeta[key]}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </View>
        ) : null}
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
