/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { BudgetLevel } from '@build-tracker/types';
import ErrorIcon from '../../icons/Error';
import React from 'react';
import { Td } from '../Table';
import Tooltip from '../Tooltip';
import WarningIcon from '../../icons/Warning';
import { DeltaCell as Cell, TotalDeltaCell as TDCell } from '@build-tracker/comparator';
import { formatBudgetResult, formatBytes } from '@build-tracker/formatting';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
  cell: Cell | TDCell;
  sizeKey: string;
  style?: StyleProp<ViewStyle>;
}

export interface Color {
  red: number;
  green: number;
  blue: number;
}

export const happy: Color = {
  red: 6,
  green: 176,
  blue: 41
};

export const danger: Color = {
  red: 249,
  green: 84,
  blue: 84
};

export const warning: Color = {
  red: 237,
  green: 170,
  blue: 46
};

export const scale = ({ red, blue, green }: Color, percentDelta: number): string =>
  `rgba(${red},${green},${blue},${Math.max(Math.min(Math.abs(percentDelta), 1), 0)})`;

export const DeltaCell = (props: Props): React.ReactElement => {
  const { cell, sizeKey, style } = props;
  const sizeDelta = cell.sizes[sizeKey];
  const percentDelta = cell.percents[sizeKey];
  const viewRef: React.RefObject<View> = React.useRef(null);
  const [showTooltip, setTooltipVisibility] = React.useState(false);

  const handleEnter = React.useCallback(() => {
    setTooltipVisibility(true);
  }, []);

  const handleExit = React.useCallback(() => {
    setTooltipVisibility(false);
  }, []);

  const failingBudgets = cell.failingBudgets;
  const errorBudgets = failingBudgets.filter(budget => budget.level === BudgetLevel.ERROR);
  const warningBudgets = failingBudgets.filter(budget => budget.level === BudgetLevel.WARN);

  let backgroundColor = 'transparent';
  if (errorBudgets.length) {
    backgroundColor = scale(danger, 1);
  } else if (warningBudgets.length) {
    backgroundColor = scale(warning, 1);
  } else if (percentDelta > 0) {
    backgroundColor = scale(danger, percentDelta);
  } else if (sizeDelta === 0 && cell.hashChanged) {
    backgroundColor = scale(warning, 0.5);
  } else if (sizeDelta !== 0) {
    backgroundColor = scale(happy, percentDelta);
  }

  const stringChange = `${sizeDelta} bytes (${(percentDelta * 100).toFixed(3)}%)`;
  const title = cell.hashChanged && sizeDelta === 0 ? `Unexpected hash change! ${stringChange}` : stringChange;

  const text = sizeDelta === 0 ? cell.hashChanged ? <WarningIcon /> : '' : formatBytes(sizeDelta);
  const tooltipText = failingBudgets.length
    ? failingBudgets.map(budget => formatBudgetResult(budget, cell.name)).join(', ')
    : sizeDelta === 0 && cell.hashChanged
    ? `The hash for "${cell.name}" unexpectedly changed`
    : `"${cell.name}" changed by ${stringChange}`;

  return (
    <Td accessibilityLabel={title} style={[style, { backgroundColor }]}>
      {text ? (
        // @ts-ignore
        <View
          onMouseEnter={handleEnter}
          onMouseLeave={handleExit}
          ref={viewRef}
          style={styles.textWrapper}
          testID="delta"
        >
          <Text>
            {errorBudgets.length ? <ErrorIcon /> : warningBudgets.length ? <WarningIcon /> : null}
            {failingBudgets.length ? ' ' : null}
          </Text>
          <Text>{text}</Text>
        </View>
      ) : null}
      {showTooltip ? <Tooltip relativeTo={viewRef} text={tooltipText} /> : null}
    </Td>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

export default React.memo(DeltaCell);
