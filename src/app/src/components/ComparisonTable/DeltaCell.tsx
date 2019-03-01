/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { DeltaCell as Cell } from '@build-tracker/comparator';
import { formatBytes } from '@build-tracker/formatting';
import React from 'react';
import { Td } from './../Table';
import Tooltip from '../Tooltip';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  sizeKey: string;
  style?: StyleProp<ViewStyle>;
}

export interface Color {
  red: number;
  green: number;
  blue: number;
}

export const green: Color = {
  red: 6,
  green: 176,
  blue: 41
};

export const red: Color = {
  red: 249,
  green: 84,
  blue: 84
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
  }, [setTooltipVisibility]);

  const handleExit = React.useCallback(() => {
    setTooltipVisibility(false);
  }, [setTooltipVisibility]);

  const backgroundColor =
    percentDelta > 0
      ? scale(red, percentDelta)
      : sizeDelta === 0
      ? cell.hashChanged
        ? scale(red, 1)
        : 'transparent'
      : scale(green, percentDelta);

  const stringChange = `${sizeDelta} bytes (${(percentDelta * 100).toFixed(3)}%)`;
  const title = cell.hashChanged && sizeDelta === 0 ? `Unexpected hash change! ${stringChange}` : stringChange;

  const text = sizeDelta === 0 ? (cell.hashChanged ? '⚠️' : '') : formatBytes(sizeDelta);
  const tooltipText =
    sizeDelta === 0 && cell.hashChanged
      ? `The hash for "${cell.name}" unexpectedly changed`
      : `"${cell.name}" changed by ${stringChange}`;

  return (
    <Td accessibilityLabel={title} style={[style, { backgroundColor }]}>
      {text ? (
        // @ts-ignore
        <View onMouseEnter={handleEnter} onMouseLeave={handleExit} ref={viewRef} testID="delta">
          <Text>{text}</Text>
        </View>
      ) : null}
      {showTooltip ? <Tooltip relativeTo={viewRef} text={tooltipText} /> : null}
    </Td>
  );
};

export default React.memo(DeltaCell);
