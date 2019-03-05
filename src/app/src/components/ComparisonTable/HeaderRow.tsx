/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import RevisionCell from './RevisionCell';
import RevisionDeltaCell from './RevisionDeltaCell';
import { StyleSheet } from 'react-native';
import TextCell from './TextCell';
import { Tr } from './../Table';
import { CellType, HeaderRow as HRow } from '@build-tracker/comparator';

interface Props {
  onFocusRevision: (artifactName: string) => void;
  onRemoveRevision: (artifactName: string) => void;
  row: HRow;
}

export const HeaderRow = (props: Props): React.ReactElement => {
  const { onFocusRevision, onRemoveRevision, row } = props;

  const mapHeaderCell = (cell, i): React.ReactElement | void => {
    switch (cell.type) {
      case CellType.TEXT:
        return <TextCell cell={cell} header key={cell.text} style={styles.headerCell} />;
      case CellType.REVISION:
        return (
          <RevisionCell
            cell={cell}
            key={cell.revision}
            onFocus={onFocusRevision}
            onRemove={onRemoveRevision}
            style={styles.headerCell}
          />
        );
      case CellType.REVISION_DELTA:
        return (
          <RevisionDeltaCell
            cell={cell}
            key={`${cell.revision}-${cell.againstRevision}-${i}`}
            style={styles.headerCell}
          />
        );
    }
  };

  return <Tr style={styles.headerRow}>{row.map(mapHeaderCell)}</Tr>;
};

const styles = StyleSheet.create({
  headerCell: {
    backgroundColor: 'white',
    // @ts-ignore
    position: 'sticky',
    top: 0,
    zIndex: 4,
    height: 'calc(4rem - 1px)'
  }
});

export default React.memo(HeaderRow);
