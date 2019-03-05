/**
 * Copyright (c) 2019 Paul Armstrong
 */
import BodyRow from './BodyRow';
import Comparator from '@build-tracker/comparator';
import GroupRow from './GroupRow';
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
  hoveredArtifacts: Array<string>;
  onDisableArtifacts: (artifactNames: Array<string>) => void;
  onEnableArtifacts: (artifactNames: Array<string>) => void;
  onFocusRevision: (revision: string) => void;
  onHoverArtifacts: (artifactNames: Array<string>) => void;
  onRemoveRevision: (revision: string) => void;
  sizeKey: string;
}

const ComparisonTable = (props: Props): React.ReactElement => {
  const {
    activeArtifacts,
    comparator,
    disabledArtifactsVisible,
    hoveredArtifacts,
    onDisableArtifacts,
    onEnableArtifacts,
    onFocusRevision,
    onHoverArtifacts,
    onRemoveRevision,
    sizeKey
  } = props;
  const colorScale = props.colorScale.domain([0, comparator.artifactNames.length]);
  const matrix = comparator.toJSON();

  const handleMouseOut = React.useCallback(() => {
    onHoverArtifacts([]);
  }, [onHoverArtifacts]);

  const handleHoverArtifact = React.useCallback(
    (artifactName: string): void => {
      onHoverArtifacts([artifactName]);
    },
    [onHoverArtifacts]
  );

  const handleDisableArtifact = React.useCallback(
    (artifactName: string): void => {
      onDisableArtifacts([artifactName]);
    },
    [onDisableArtifacts]
  );

  const handleEnableArtifact = React.useCallback(
    (artifactName: string): void => {
      onEnableArtifacts([artifactName]);
    },
    [onEnableArtifacts]
  );

  return (
    <Table onMouseLeave={handleMouseOut} style={styles.table}>
      <Thead>
        <HeaderRow onFocusRevision={onFocusRevision} onRemoveRevision={onRemoveRevision} row={matrix.header} />
        <GroupRow
          colorScale={colorScale}
          isActive={Object.values(activeArtifacts).every(Boolean)}
          isHovered={false}
          key={'All'}
          onDisable={onDisableArtifacts}
          onEnable={onEnableArtifacts}
          onHover={onHoverArtifacts}
          row={matrix.total}
          rowIndex={-1}
          sizeKey={sizeKey}
        />
      </Thead>
      <Tbody>
        {matrix.groups.map((row, i) => {
          const { artifactNames, text: groupName } = row[0];
          const isActive = Object.keys(activeArtifacts)
            .filter(artifactName => artifactNames.includes(artifactName))
            .every(artifactName => activeArtifacts[artifactName]);
          if (!isActive && !disabledArtifactsVisible) {
            return null;
          }
          return (
            <GroupRow
              colorScale={colorScale}
              isActive={isActive}
              isHovered={artifactNames.every(artifactName => hoveredArtifacts.includes(artifactName))}
              key={groupName}
              onDisable={onDisableArtifacts}
              onEnable={onEnableArtifacts}
              onHover={onHoverArtifacts}
              row={row}
              rowIndex={i}
              sizeKey={sizeKey}
            />
          );
        })}
        {matrix.artifacts.map((row, i) => {
          const artifactName = row[0].text;
          const isActive = activeArtifacts[artifactName];
          if (!isActive && !disabledArtifactsVisible) {
            return null;
          }
          return (
            <BodyRow
              colorScale={colorScale}
              isActive={isActive}
              isHovered={hoveredArtifacts.includes(artifactName)}
              key={artifactName}
              onDisableArtifact={handleDisableArtifact}
              onEnableArtifact={handleEnableArtifact}
              onHoverArtifact={handleHoverArtifact}
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
