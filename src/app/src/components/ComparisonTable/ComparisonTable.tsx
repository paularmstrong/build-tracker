import ArtifactCell from './ArtifactCell';
import DeltaCell from './DeltaCell';
import React from 'react';
import RevisionCell from './RevisionCell';
import RevisionDeltaCell from './RevisionDeltaCell';
import { StyleSheet } from 'react-native';
import TextCell from './TextCell';
import TotalCell from './TotalCell';
import TotalDeltaCell from './TotalDeltaCell';
import Comparator, { BodyCell, CellType, TotalDeltaCell as TDCell } from '@build-tracker/comparator';
import { Table, Tbody, Thead, Tr } from './Table';

interface Props {
  comparator: Comparator;
  sizeKey: string;
}

const ComparisonTable = (props: Props): React.ReactElement => {
  const { comparator, sizeKey } = props;
  const matrix = comparator.toJSON();

  const mapBodyCell = (cell: BodyCell | TDCell, i: number): React.ReactElement => {
    switch (cell.type) {
      case CellType.TEXT:
        return <TextCell cell={cell} key={i} />;
      case CellType.ARTIFACT:
        return <ArtifactCell cell={cell} key={i} />;
      case CellType.DELTA:
        return <DeltaCell cell={cell} key={i} sizeKey={sizeKey} />;
      case CellType.TOTAL:
        return <TotalCell cell={cell} key={i} sizeKey={sizeKey} />;
      case CellType.TOTAL_DELTA:
        return <TotalDeltaCell cell={cell} key={i} sizeKey={sizeKey} />;
    }
  };

  return (
    <Table style={styles.table}>
      <Thead>
        <Tr style={styles.headerRow}>
          {matrix.header.map((cell, i) => {
            switch (cell.type) {
              case CellType.TEXT:
                return <TextCell cell={cell} header key={i} style={styles.headerCell} />;
              case CellType.REVISION:
                return <RevisionCell cell={cell} key={i} style={styles.headerCell} />;
              case CellType.REVISION_DELTA:
                return <RevisionDeltaCell cell={cell} key={i} style={styles.headerCell} />;
            }
          })}
        </Tr>
        <Tr>{matrix.total.map(mapBodyCell)}</Tr>
      </Thead>
      <Tbody>
        {matrix.body.map((row, i) => (
          <Tr key={i}>{row.map(mapBodyCell)}</Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const styles = StyleSheet.create({
  table: {
    position: 'relative'
  },
  headerCell: {
    // @ts-ignore
    position: 'sticky',
    top: 0,
    zIndex: 2,
    height: 'calc(4rem - 1px)'
  }
});

export default ComparisonTable;
