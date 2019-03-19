/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import DeltaCell from './DeltaCell';
import GroupCell from './GroupCell';
import React from 'react';
import { StyleSheet } from 'react-native';
import TotalCell from './TotalCell';
import { Tr } from './../Table';
import {
  CellType,
  GroupCell as GCell,
  GroupRow as GRow,
  TotalCell as TCell,
  TotalDeltaCell as TDCell
} from '@build-tracker/comparator';

interface Props {
  isActive: boolean;
  onDisable: (artifactNames: Array<string>) => void;
  onEnable: (artifactNames: Array<string>) => void;
  onFocus: (artifactName: Array<string>) => void;
  onHover: (artifactNames: Array<string>) => void;
  row: GRow;
  sizeKey: string;
}

export const GroupRow = (props: Props): React.ReactElement => {
  const { isActive, onDisable, onEnable, onFocus, onHover, row, sizeKey } = props;

  const mapGroupCell = (cell: GCell | TCell | TDCell, i: number): React.ReactElement | void => {
    switch (cell.type) {
      case CellType.GROUP: {
        return (
          <GroupCell
            cell={cell}
            key={i}
            isActive={isActive}
            onDisable={onDisable}
            onEnable={onEnable}
            onFocus={onFocus}
            style={styles.cell}
          />
        );
      }
      case CellType.TOTAL:
        return <TotalCell cell={cell} key={i} sizeKey={sizeKey} style={styles.cell} />;
      case CellType.TOTAL_DELTA:
        return <DeltaCell cell={cell} key={i} sizeKey={sizeKey} style={styles.cell} />;
    }
  };

  const { artifactNames } = row[0];

  const handleMouseEnter = React.useCallback(() => {
    onHover(isActive ? artifactNames : []);
  }, [artifactNames, isActive, onHover]);

  // @ts-ignore
  const rows = row.map(mapGroupCell);

  return (
    <Tr onMouseEnter={handleMouseEnter} style={[styles.row]}>
      {rows}
    </Tr>
  );
};

const styles = StyleSheet.create({
  row: {
    backgroundColor: Theme.Color.Gray05,
    // @ts-ignore
    transitionProperty: 'background-color',
    transitionDuration: '0.1s'
  },
  cell: {
    borderColor: Theme.Color.Gray20
  }
});

export default React.memo(GroupRow);
