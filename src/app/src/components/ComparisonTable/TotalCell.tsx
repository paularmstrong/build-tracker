/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { TotalCell as Cell } from '@build-tracker/comparator';
import CloseIcon from '../../icons/Close';
import { formatBytes } from '@build-tracker/formatting';
import React from 'react';
import RelativeModal from '../RelativeModal';
import TabularMetadata from '../TabularMetadata';
import { Td } from '../Table';
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  sizeKey: string;
  style?: StyleProp<ViewStyle>;
}

export const TotalCell = (props: Props): React.ReactElement => {
  const { cell, sizeKey, style } = props;
  const value = cell.sizes[sizeKey];
  const text = value === 0 ? '' : formatBytes(value);

  const cellRef = React.useRef();
  const [dialogVisible, setDialogVisible] = React.useState(false);

  const handlePress = React.useCallback((): void => {
    setDialogVisible(true);
  }, [setDialogVisible]);

  const handleDismissDialog = React.useCallback((): void => {
    setDialogVisible(false);
  }, [setDialogVisible]);

  const tableData = Object.keys(cell.sizes).reduce((memo: Array<[string, string]>, metaKey: string): Array<
    [string, string]
  > => {
    memo.push([metaKey, formatBytes(cell.sizes[metaKey])]);
    return memo;
  }, []);

  return (
    <Td style={style}>
      <TouchableOpacity onPress={handlePress} ref={cellRef}>
        {text ? <Text>{text}</Text> : null}
      </TouchableOpacity>
      {dialogVisible ? (
        <RelativeModal onDismiss={handleDismissDialog} portalRootID="menuPortal" relativeTo={cellRef}>
          <TabularMetadata data={tableData} icon={CloseIcon} onClose={handleDismissDialog} title={cell.name} />
        </RelativeModal>
      ) : null}
    </Td>
  );
};

export default React.memo(TotalCell);
