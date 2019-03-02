/**
 * Copyright (c) 2019 Paul Armstrong
 */
import BodyRow from './BodyRow';
import Comparator from '@build-tracker/comparator';
import HeaderRow from './HeaderRow';
import React from 'react';
import { ScaleSequential } from 'd3-scale';
import { StyleSheet } from 'react-native';
import { Table, Tbody, Thead } from './../Table';

interface Props {
  activeArtifacts: { [key: string]: boolean };
  colorScale: ScaleSequential<string>;
  comparator: Comparator;
  disabledArtifactsVisible: boolean;
  hoveredArtifact: string;
  onDisableArtifact: (artifactName: string) => void;
  onEnableArtifact: (artifactName: string) => void;
  onFocusRevision: (revision: string) => void;
  onHoverArtifact: (revision: string) => void;
  onRemoveRevision: (revision: string) => void;
  sizeKey: string;
}

const ComparisonTable = (props: Props): React.ReactElement => {
  const {
    activeArtifacts,
    comparator,
    disabledArtifactsVisible,
    hoveredArtifact,
    onDisableArtifact,
    onEnableArtifact,
    onFocusRevision,
    onHoverArtifact,
    onRemoveRevision,
    sizeKey
  } = props;
  const colorScale = props.colorScale.domain([0, comparator.artifactNames.length]);
  const matrix = comparator.toJSON();

  const handleMouseOut = React.useCallback(() => {
    onHoverArtifact(null);
  }, [onHoverArtifact]);

  return (
    <Table onMouseLeave={handleMouseOut} style={styles.table}>
      <Thead>
        <HeaderRow onFocusRevision={onFocusRevision} onRemoveRevision={onRemoveRevision} row={matrix.header} />
        <BodyRow
          colorScale={colorScale}
          isActive={Object.values(activeArtifacts).every(Boolean)}
          isHovered={false}
          key={'All'}
          onDisableArtifact={onDisableArtifact}
          onEnableArtifact={onEnableArtifact}
          onHoverArtifact={onHoverArtifact}
          row={matrix.total}
          rowIndex={-1}
          sizeKey={sizeKey}
        />
      </Thead>
      <Tbody>
        {matrix.body.map((row, i) => {
          // @ts-ignore
          const artifactName = 'text' in row[0] && row[0].text;
          const isActive = activeArtifacts[artifactName];
          if (!isActive && !disabledArtifactsVisible) {
            return null;
          }
          return (
            <BodyRow
              colorScale={colorScale}
              isActive={isActive}
              isHovered={artifactName === hoveredArtifact}
              key={artifactName}
              onDisableArtifact={onDisableArtifact}
              onEnableArtifact={onEnableArtifact}
              onHoverArtifact={onHoverArtifact}
              row={row}
              rowIndex={i}
              sizeKey={sizeKey}
            />
          );
        })}
      </Tbody>
    </Table>
  );
};

const styles = StyleSheet.create({
  table: {
    position: 'relative'
  }
});

export default ComparisonTable;
