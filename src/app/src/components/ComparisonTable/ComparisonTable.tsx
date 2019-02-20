import ArtifactCell from './ArtifactCell';
import Build from '@build-tracker/build';
import DeltaCell from './DeltaCell';
import React from 'react';
import RevisionCell from './RevisionCell';
import RevisionDeltaCell from './RevisionDeltaCell';
import TextCell from './TextCell';
import TotalCell from './TotalCell';
import Comparator, { BodyCell, CellType } from '@build-tracker/comparator';
import { StyleSheet } from 'react-native';
import { Table, Thead, Tbody, Tr } from './Table';

interface Props {
  builds: Array<Build>;
}

const mapBodyCell = (cell: BodyCell, i: number): React.ReactElement => {
  switch (cell.type) {
    case CellType.TEXT:
      return <TextCell cell={cell} key={i} />;
    case CellType.ARTIFACT:
      return <ArtifactCell cell={cell} key={i} />;
    case CellType.DELTA:
      return <DeltaCell cell={cell} key={i} />;
    case CellType.TOTAL:
      return <TotalCell cell={cell} key={i} />;
  }
};

const ComparisonTable = (props: Props): React.ReactElement => {
  const comparator = React.useMemo((): Comparator => new Comparator({ builds: props.builds }), [props.builds]);
  const matrix = comparator.toJSON();

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
