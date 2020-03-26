/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import { StyleProp, StyleSheet, TextStyle, unstable_createElement, ViewProps, ViewStyle } from 'react-native';

interface TableProps extends ViewProps {
  children?: React.ReactNode;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  style?: StyleProp<TextStyle & ViewStyle>;
  title?: string;
}

export const Table = (props: TableProps): React.ReactElement =>
  unstable_createElement('table', { ...props, accessibilityRole: 'table', style: [styles.table, props.style] });

export const Thead = (props: TableProps): React.ReactElement =>
  unstable_createElement('thead', { ...props, accessibilityRole: 'group', style: [styles.group, props.style] });

export const Tbody = (props: TableProps): React.ReactElement =>
  unstable_createElement('tbody', { ...props, accessibilityRole: 'group', style: [styles.group, props.style] });

export const Tr = (props: TableProps): React.ReactElement =>
  unstable_createElement('tr', { ...props, accessibilityRole: 'row', style: [styles.row, props.style] });

export const Th = (props: TableProps): React.ReactElement =>
  unstable_createElement('th', { ...props, accessibilityRole: 'cell', style: [styles.cell, props.style] });

export const Td = (props: TableProps): React.ReactElement =>
  unstable_createElement('td', { ...props, accessibilityRole: 'cell', style: [styles.cell, props.style] });

const styles = StyleSheet.create({
  table: {
    borderCollapse: 'collapse',
  },
  group: {
    boxSizing: 'border-box',
  },
  row: {
    boxSizing: 'border-box',
  },
  cell: {
    boxSizing: 'border-box',
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomStyle: 'solid',
    borderRightStyle: 'dotted',
    borderColor: Theme.Color.Gray10,
    margin: 0,
    paddingHorizontal: Theme.Spacing.Xsmall,
    textAlign: 'right',
  },
});
