/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { TotalDeltaCell as Cell } from '@build-tracker/comparator';
import { formatBytes } from '@build-tracker/formatting';
import React from 'react';
import { Td } from './../Table';
import Tooltip from '../Tooltip';
import { green, red, scale } from './DeltaCell';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  sizeKey: string;
  style?: StyleProp<ViewStyle>;
}

export const TotalDeltaCell = (props: Props): React.ReactElement => {
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
    percentDelta > 0 ? scale(red, percentDelta) : sizeDelta === 0 ? 'white' : scale(green, percentDelta);

  const stringChange = `${sizeDelta} bytes (${(percentDelta * 100).toFixed(3)}%)`;
  const text = sizeDelta === 0 ? '' : formatBytes(sizeDelta);
  const tooltipText =
    sizeDelta === 0
      ? 'This build did not change total size'
      : `This build had a total artifact change of ${stringChange}`;

  return (
    <Td accessibilityLabel={stringChange} style={[style, { backgroundColor }]}>
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

export default React.memo(TotalDeltaCell);
