// @flow
import * as React from 'react';
import type { BT$BodyCellType } from '@build-tracker/types';
import deepEqual from 'deep-equal';

type Props = {|
  isHovered: boolean,
  render: (cell: BT$BodyCellType, cellIndex: number, artifactName: string, isHovered: boolean) => React.Node,
  row: Array<BT$BodyCellType>
|};

export default class ArtifactRow extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return nextProps.isHovered !== this.props.isHovered || !deepEqual(nextProps.row, this.props.row);
  }

  render() {
    const { isHovered, render, row } = this.props;
    const artifactName = row[0].text ? row[0].text : '';
    return row.map((cell, i) => render(cell, i, artifactName, isHovered));
  }
}
