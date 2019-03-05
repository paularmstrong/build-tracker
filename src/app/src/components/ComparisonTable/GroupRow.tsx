/**
 * Copyright (c) 2019 Paul Armstrong
 */
import GroupCell from './GroupCell';
import { hsl } from 'd3-color';
import React from 'react';
import { ScaleSequential } from 'd3-scale';
import { StyleSheet } from 'react-native';
import TotalCell from './TotalCell';
import TotalDeltaCell from './TotalDeltaCell';
import { Tr } from './../Table';
import {
  CellType,
  DeltaCell as DCell,
  GroupCell as GCell,
  GroupRow as GRow,
  TotalCell as TCell,
  TotalDeltaCell as TDCell
} from '@build-tracker/comparator';

interface Props {
  colorScale: ScaleSequential<string>;
  isActive: boolean;
  isHovered: boolean;
  onDisable: (artifactNames: Array<string>) => void;
  onEnable: (artifactNames: Array<string>) => void;
  onHover: (artifactNames: Array<string>) => void;
  row: GRow;
  rowIndex: number;
  sizeKey: string;
}

export const GroupRow = (props: Props): React.ReactElement => {
  const { colorScale, isActive, isHovered, onDisable, onEnable, onHover, row, rowIndex, sizeKey } = props;

  const mapGroupCell = (cell: GCell | TCell | TDCell | DCell, i: number): React.ReactElement | void => {
    switch (cell.type) {
      case CellType.GROUP: {
        return (
          <GroupCell
            cell={cell}
            color={colorScale(rowIndex)}
            key={i}
            isActive={isActive}
            onDisable={onDisable}
            onEnable={onEnable}
          />
        );
      }
      case CellType.TOTAL:
        return <TotalCell cell={cell} key={i} sizeKey={sizeKey} />;
      case CellType.TOTAL_DELTA:
        return <TotalDeltaCell cell={cell} key={i} sizeKey={sizeKey} />;
    }
  };

  let backgroundColor = 'transparent';
  const { artifactNames } = row[0];
  if (isHovered) {
    const color = hsl(colorScale(rowIndex));
    color.l = 0.9;
    backgroundColor = color.toString();
  }
  const handleMouseEnter = React.useCallback(() => {
    onHover(isActive ? artifactNames : []);
  }, [artifactNames, isActive, onHover]);

  // @ts-ignore
  const rows = row.map(mapGroupCell);

  return (
    <Tr onMouseEnter={handleMouseEnter} style={[styles.row, { backgroundColor }]}>
      {rows}
    </Tr>
  );
};

const styles = StyleSheet.create({
  row: {
    // @ts-ignore
    transitionProperty: 'background-color',
    transitionDuration: '0.1s'
  }
});

export default React.memo(GroupRow);
