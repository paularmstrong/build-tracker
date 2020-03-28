/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { BudgetLevel } from '@build-tracker/types';
import CloseIcon from '../../icons/Close';
import ErrorIcon from '../../icons/Error';
import HashIcon from '../../icons/Hash';
import Hoverable from '../Hoverable';
import React from 'react';
import RelativeModal from '../RelativeModal';
import RelativeTooltip from '../RelativeTooltip';
import TabularMetadata from '../TabularMetadata';
import { Td } from '../Table';
import { TouchableOpacity } from 'react-native';
import WarningIcon from '../../icons/Warning';
import { DeltaCell as Cell, TotalDeltaCell as TDCell } from '@build-tracker/comparator';
import { formatBudgetResult, formatBytes, formatUnexpectedHashChange } from '@build-tracker/formatting';
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
  blue: 41,
};

export const danger: Color = {
  red: 249,
  green: 84,
  blue: 84,
};

export const warning: Color = {
  red: 237,
  green: 170,
  blue: 46,
};

export const scale = ({ red, blue, green }: Color, percentDelta: number): string =>
  `rgba(${red},${green},${blue},${Math.max(Math.min(Math.abs(percentDelta), 1), 0)})`;

const formatPercentChange = (percentDelta: number): string => `${(percentDelta * 100).toFixed(3)}%`;

export const DeltaCell = (props: Props): React.ReactElement => {
  const { cell, sizeKey, style } = props;
  const sizeDelta = cell.sizes[sizeKey];
  const percentDelta = cell.percents[sizeKey];
  const viewRef: React.RefObject<View> = React.useRef(null);
  const cellRef = React.useRef();

  const failingBudgets = cell.failingBudgets;
  const errorBudgets = failingBudgets.filter((budget) => budget.level === BudgetLevel.ERROR);
  const warningBudgets = failingBudgets.filter((budget) => budget.level === BudgetLevel.WARN);

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

  const stringChange = `${sizeDelta} bytes (${formatPercentChange(percentDelta)})`;

  const text = formatBytes(sizeDelta);
  const hashChangedOnly = cell.hashChangeUnexpected;
  const tooltipText = failingBudgets.length
    ? failingBudgets.map((budget) => formatBudgetResult(budget, cell.name)).join(', ')
    : hashChangedOnly
    ? formatUnexpectedHashChange(cell.name, false)
    : `"${cell.name}" changed by ${stringChange}`;

  const [dialogVisible, setDialogVisible] = React.useState(false);

  const handlePress = React.useCallback((): void => {
    setDialogVisible(true);
  }, [setDialogVisible]);

  const handleDismissDialog = React.useCallback((): void => {
    setDialogVisible(false);
  }, [setDialogVisible]);

  const tableData = Object.keys(cell.sizes).reduce((memo: Array<[string, string]>, sizeKey: string): Array<
    [string, string]
  > => {
    memo.push([sizeKey, `${formatBytes(cell.sizes[sizeKey])} (${formatPercentChange(cell.percents[sizeKey])})`]);
    return memo;
  }, []);

  const tableFooter = failingBudgets.length ? (
    failingBudgets.map((budget, index) => <Text key={index}>{formatBudgetResult(budget, cell.name, true)}</Text>)
  ) : hashChangedOnly ? (
    <Text>{formatUnexpectedHashChange(cell.name, true)}</Text>
  ) : null;

  return (
    <Td accessibilityLabel={tooltipText} style={[style, { backgroundColor }]}>
      {text ? (
        <TouchableOpacity onPress={handlePress} ref={cellRef}>
          <Hoverable>
            {(isHovered) => (
              <View ref={viewRef} style={styles.textWrapper} testID="delta">
                {sizeDelta !== 0 || hashChangedOnly ? (
                  <Text>
                    {errorBudgets.length ? (
                      <ErrorIcon />
                    ) : warningBudgets.length ? (
                      <WarningIcon />
                    ) : hashChangedOnly ? (
                      <HashIcon />
                    ) : (
                      ''
                    )}{' '}
                  </Text>
                ) : null}
                {sizeDelta !== 0 ? <Text>{text}</Text> : null}
                {isHovered ? <RelativeTooltip relativeTo={viewRef} text={tooltipText} /> : null}
              </View>
            )}
          </Hoverable>
          {dialogVisible ? (
            <RelativeModal onDismiss={handleDismissDialog} portalRootID="menuPortal" relativeTo={cellRef}>
              <TabularMetadata
                data={tableData}
                footer={<View>{tableFooter}</View>}
                icon={CloseIcon}
                onClose={handleDismissDialog}
                title={`${cell.name} delta`}
              />
            </RelativeModal>
          ) : null}
        </TouchableOpacity>
      ) : null}
    </Td>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default React.memo(DeltaCell);
