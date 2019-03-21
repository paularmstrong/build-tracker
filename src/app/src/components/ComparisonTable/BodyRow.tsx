/**
 * Copyright (c) 2019 Paul Armstrong
 */
import ArtifactCell from './ArtifactCell';
import DeltaCell from './DeltaCell';
import { hsl } from 'd3-color';
import React from 'react';
import { ScaleSequential } from 'd3-scale';
import { StyleSheet } from 'react-native';
import TotalCell from './TotalCell';
import { Tr } from './../Table';
import {
  ArtifactCell as ACell,
  ArtifactRow,
  CellType,
  DeltaCell as DCell,
  GroupRow,
  TotalCell as TCell,
  TotalDeltaCell as TDCell
} from '@build-tracker/comparator';

interface Props {
  colorScale: ScaleSequential<string>;
  isActive: boolean;
  isHovered: boolean;
  onDisableArtifact: (artifactName: string) => void;
  onEnableArtifact: (artifactName: string) => void;
  onFocusArtifact: (artifactName: string) => void;
  onHoverArtifact: (revision: string) => void;
  row: ArtifactRow | GroupRow;
  rowIndex: number;
  sizeKey: string;
}

export const BodyRow = (props: Props): React.ReactElement => {
  const {
    colorScale,
    isActive,
    isHovered,
    onDisableArtifact,
    onEnableArtifact,
    onFocusArtifact,
    onHoverArtifact,
    row,
    rowIndex,
    sizeKey
  } = props;

  const mapBodyCell = (cell: ACell | TCell | TDCell | DCell, i: number): React.ReactElement | void => {
    switch (cell.type) {
      case CellType.ARTIFACT: {
        return (
          <ArtifactCell
            cell={cell}
            color={colorScale(rowIndex)}
            key={i}
            isActive={isActive}
            onDisable={onDisableArtifact}
            onEnable={onEnableArtifact}
            onFocus={onFocusArtifact}
          />
        );
      }
      case CellType.DELTA:
        return <DeltaCell cell={cell} key={i} sizeKey={sizeKey} />;
      case CellType.TOTAL:
        return <TotalCell cell={cell} key={i} sizeKey={sizeKey} />;
    }
  };

  let backgroundColor = 'transparent';
  const artifactName = row[0].text;
  if (isHovered) {
    const color = hsl(colorScale(rowIndex));
    color.l = 0.9;
    backgroundColor = color.toString();
  }
  const handleMouseEnter = React.useCallback(() => {
    onHoverArtifact(isActive ? artifactName : null);
  }, [artifactName, isActive, onHoverArtifact]);

  // @ts-ignore
  const rows = row.map(mapBodyCell);

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

export default React.memo(BodyRow);
