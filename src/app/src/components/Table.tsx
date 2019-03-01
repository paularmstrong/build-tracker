/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import { createElement, StyleProp, StyleSheet, ViewProps, ViewStyle } from 'react-native';

interface TableProps extends ViewProps {
  children?: React.ReactNode;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  style?: StyleProp<ViewStyle>;
  title?: string;
}

export const Table = (props: TableProps): React.ReactElement =>
  createElement('table', { ...props, accessibilityRole: 'table', style: [styles.table, props.style] });

export const Thead = (props: TableProps): React.ReactElement =>
  createElement('thead', { ...props, accessibilityRole: 'group', style: [styles.group, props.style] });

export const Tbody = (props: TableProps): React.ReactElement =>
  createElement('tbody', { ...props, accessibilityRole: 'group', style: [styles.group, props.style] });

export const Tr = (props: TableProps): React.ReactElement =>
  createElement('tr', { ...props, accessibilityRole: 'row', style: [styles.row, props.style] });

export const Th = (props: TableProps): React.ReactElement =>
  createElement('th', { ...props, accessibilityRole: 'cell', style: [styles.cell, props.style] });

export const Td = (props: TableProps): React.ReactElement =>
  createElement('td', { ...props, accessibilityRole: 'cell', style: [styles.cell, props.style] });

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
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomStyle: 'solid',
    borderRightStyle: 'dotted',
    borderColor: Theme.Color.Gray10,
    margin: 0,
    paddingHorizontal: Theme.Spacing.Xsmall,
    textAlign: 'right'
  }
});
