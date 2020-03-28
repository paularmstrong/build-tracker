/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import { BuildMetaItem } from '@build-tracker/build';
import Button from './Button';
import CloseIcon from '../icons/Close';
import React from 'react';
import TextLink from './TextLink';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { Table, Tbody, Td, Th, Tr } from './Table';

interface Props {
  closeButtonLabel?: string;
  data: Array<[string, BuildMetaItem]>;
  footer?: React.ReactElement;
  icon?: React.ComponentType<{ style?: StyleProp<TextStyle> }>;
  onClose?: () => void;
  title: string;
}

function getMetaValue(val: string | BuildMetaItem): string {
  // @ts-ignore
  return typeof val === 'object' && val.hasOwnProperty('value') ? val.value : val;
}

function getMetaUrl(val: string | BuildMetaItem): string | undefined {
  // @ts-ignore
  return typeof val === 'object' && val.hasOwnProperty('url') ? val.url : undefined;
}

const TabularMetadata = (props: Props): React.ReactElement => {
  const { closeButtonLabel, data, footer, icon, onClose, title } = props;

  const handleClose = React.useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        <Button icon={icon || CloseIcon} iconOnly onPress={handleClose} title={closeButtonLabel || 'Close'} />
      </View>
      <Table>
        <Tbody>
          {data.map(([key, dataValue]) => {
            const value = getMetaValue(dataValue);
            const url = getMetaUrl(dataValue);
            return (
              <Tr key={key}>
                <Th>
                  <Text>{key}</Text>
                </Th>
                <Td style={styles.infoCell}>{url ? <TextLink href={url} text={value} /> : <Text>{value}</Text>}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: Theme.Spacing.Small,
    paddingHorizontal: Theme.Spacing.Small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: Theme.FontWeight.Bold,
    fontSize: Theme.FontSize.Normal,
  },
  infoCell: {
    textAlign: 'left',
  },
  footer: {
    alignItems: 'flex-start',
    paddingTop: Theme.Spacing.Normal,
  },
});

export default TabularMetadata;
