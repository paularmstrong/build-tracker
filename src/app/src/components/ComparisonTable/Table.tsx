import * as Theme from '../../theme';
import { createElement, StyleProp, StyleSheet, ViewProps, ViewStyle } from 'react-native';

interface TableProps extends ViewProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Table = (props: TableProps): React.ReactElement =>
  createElement('table', { ...props, style: [styles.table, props.style] });

export const Thead = (props: TableProps): React.ReactElement =>
  createElement('thead', { ...props, style: [styles.group, props.style] });

export const Tbody = (props: TableProps): React.ReactElement =>
  createElement('tbody', { ...props, style: [styles.group, props.style] });

export const Tfoot = (props: TableProps): React.ReactElement =>
  createElement('tfoot', { ...props, style: [styles.group, props.style] });

export const Tr = (props: TableProps): React.ReactElement =>
  createElement('tr', { ...props, style: [styles.row, props.style] });

export const Th = (props: TableProps): React.ReactElement =>
  createElement('th', { ...props, style: [styles.cell, props.style] });

export const Td = (props: TableProps): React.ReactElement =>
  createElement('td', { ...props, style: [styles.cell, props.style] });

const styles = StyleSheet.create({
  table: {
    // @ts-ignore
    borderCollapse: 'collapse'
  },
  group: {
    // @ts-ignore
    boxSizing: 'border-box'
  },
  row: {
    // @ts-ignore
    boxSizing: 'border-box'
  },
  cell: {
    // @ts-ignore
    boxSizing: 'border-box',
    backgroundColor: Theme.Color.White,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomStyle: 'solid',
    borderRightStyle: 'dotted',
    borderColor: Theme.Color.Gray10,
    margin: 0,
    paddingHorizontal: Theme.Spacing.Xsmall,
    textAlign: 'right'
  }
});
