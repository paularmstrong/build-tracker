/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import Button from './Button';
import CollapseIcon from '../icons/Collapse';
import { formatSha } from '@build-tracker/formatting';
import React from 'react';
import RemoveIcon from '../icons/Remove';
import { State } from '../store/types';
import TextLink from './TextLink';
import { removeComparedRevision, setFocusedRevision } from '../store/actions';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Table, Tbody, Td, Th, Tr } from './Table';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  focusedRevision: string;
  style?: StyleProp<ViewStyle>;
}

const titleCase = (value: string): string => {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
};

const BuildInfo = (props: Props): React.ReactElement => {
  const { focusedRevision, style } = props;

  const build = useSelector((state: State) =>
    state.comparator.builds.find(build => build.getMetaValue('revision') === focusedRevision)
  );
  const revision = build.getMetaValue('revision');
  const revisionUrl = build.getMetaUrl('revision');

  const dispatch = useDispatch();

  const handleClose = React.useCallback(() => {
    dispatch(setFocusedRevision(undefined));
  }, [dispatch]);

  const handleRemove = React.useCallback(() => {
    dispatch(removeComparedRevision(focusedRevision));
  }, [dispatch, focusedRevision]);

  return (
    <View style={[styles.root, style]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Build: {formatSha(revision)}</Text>
        <Button icon={CollapseIcon} iconOnly onPress={handleClose} title="Collapse details" />
      </View>
      <Table>
        <Tbody>
          <Tr>
            <Th>
              <Text>Revision</Text>
            </Th>
            <Td style={styles.infoCell}>
              {revisionUrl ? <TextLink href={revisionUrl} text={revision} /> : <Text>{revision}</Text>}
            </Td>
          </Tr>
          <Tr>
            <Th>
              <Text>Date</Text>
            </Th>
            <Td style={styles.infoCell}>
              <Text>{build.timestamp.toLocaleString()}</Text>
            </Td>
          </Tr>
          {Object.keys(build.meta)
            .filter(metaKey => metaKey !== 'revision' && metaKey !== 'timestamp')
            .map(metaKey => {
              // @ts-ignore
              const value = build.getMetaValue(metaKey);
              return (
                <Tr key={metaKey}>
                  <Th>
                    <Text>{titleCase(metaKey)}</Text>
                  </Th>
                  <Td style={styles.infoCell}>
                    <Text>{value}</Text>
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
      <View style={styles.footer}>
        <Button color="secondary" icon={RemoveIcon} onPress={handleRemove} title="Remove build" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: Theme.Spacing.Normal,
    paddingHorizontal: Theme.Spacing.Large
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    fontWeight: Theme.FontWeight.Bold,
    fontSize: Theme.FontSize.Normal
  },
  infoCell: {
    textAlign: 'left'
  },
  footer: {
    alignItems: 'flex-start',
    paddingTop: Theme.Spacing.Normal
  }
});

export default BuildInfo;
