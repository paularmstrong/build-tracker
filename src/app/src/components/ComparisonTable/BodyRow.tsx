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
import { BodyCell, CellType, TotalDeltaCell as TDCell } from '@build-tracker/comparator';

interface Props {
  colorScale: ScaleSequential<string>;
  isActive: boolean;
  isHovered: boolean;
  onDisableArtifact: (artifactName: string) => void;
  onEnableArtifact: (artifactName: string) => void;
  onHoverArtifact: (revision: string) => void;
  row: Array<BodyCell>;
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
    onHoverArtifact,
    row,
    rowIndex,
    sizeKey
  } = props;

  const mapBodyCell = (cell: BodyCell | TDCell, i: number): React.ReactElement | void => {
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
  // @ts-ignore
  const artifactName = 'text' in row[0] && row[0].text;
  if (isHovered) {
    const color = hsl(colorScale(rowIndex));
    color.l = 0.9;
    backgroundColor = color.toString();
  }
  const handleMouseOut = React.useCallback(() => {
    onHoverArtifact(artifactName);
  }, [artifactName, onHoverArtifact]);

  return (
    <Tr onMouseEnter={handleMouseOut} style={[styles.row, { backgroundColor }]}>
      {row.map(mapBodyCell)}
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
