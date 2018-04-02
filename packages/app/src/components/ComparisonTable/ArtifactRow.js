// @flow
import * as React from 'react';
import ArtifactCell from './ArtifactCell';
import { CellType } from '@build-tracker/comparator';
import deepEqual from 'deep-equal';
import DeltaCell from './DeltaCell';
import { hsl } from 'd3-color';
import ValueCell from './ValueCell';
import type { BT$BodyCellType, BT$DeltaCellType, BT$TotalCellType } from '@build-tracker/types';

type Props = {|
  color: string,
  isHovered: boolean,
  isActive: boolean,
  onCellClick: Function,
  onToggleArtifact: Function,
  row: Array<BT$BodyCellType>,
  valueType: 'gzip' | 'stat'
|};

export default class ArtifactRow extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return !deepEqual(this.props, nextProps);
  }

  render() {
    const { isHovered, row } = this.props;
    const artifactName = row[0].text ? row[0].text : '';
    return row.map((cell, i) => this._renderCell(cell, i, artifactName, isHovered));
  }

  _renderCell = (cell: BT$BodyCellType, columnIndex: number, artifactName: string, isHovered: boolean) => {
    const { color, isActive, onCellClick, onToggleArtifact, valueType } = this.props;
    const hoverColor = hsl(color);
    hoverColor.s = 0.7;
    hoverColor.l = 0.95;

    switch (cell && cell.type) {
      case CellType.ARTIFACT:
        return (
          <ArtifactCell
            active={isActive}
            artifactName={artifactName}
            color={color}
            hoverColor={hoverColor.toString()}
            isHovered={isHovered}
            key={columnIndex}
            linked
            onToggle={onToggleArtifact}
          />
        );
      case CellType.DELTA: {
        // $FlowFixMe
        const deltaCell = (cell: BT$DeltaCellType);
        return (
          <DeltaCell
            gzip={deltaCell.gzip}
            gzipPercent={deltaCell.gzipPercent}
            hashChanged={deltaCell.hashChanged}
            key={columnIndex}
            stat={deltaCell.stat}
            statPercent={deltaCell.statPercent}
            valueType={valueType}
          />
        );
      }
      case CellType.TOTAL: {
        // $FlowFixMe
        const totalCell = (cell: BT$TotalCellType);
        return (
          <ValueCell
            gzip={totalCell.gzip}
            hoverColor={hoverColor}
            isHovered={isHovered}
            key={columnIndex}
            onClick={onCellClick(columnIndex)}
            stat={totalCell.stat}
            valueType={valueType}
          />
        );
      }
      default:
        return null;
    }
  };
}
