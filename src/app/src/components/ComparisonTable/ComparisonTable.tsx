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
  onFocusArtifacts: (artifactName: Array<string>) => void;
  onFocusRevision: (revision: string) => void;
  onHoverArtifacts: (artifactNames: Array<string>) => void;
  onRemoveRevision: (revision: string) => void;
  sizeKey: string;
}

const emptyArray = [];

const ComparisonTable = (props: Props): React.ReactElement => {
  const {
    activeArtifacts,
    colorScale,
    comparator,
    disabledArtifactsVisible,
    hoveredArtifacts,
    onDisableArtifacts,
    onEnableArtifacts,
    onFocusArtifacts,
    onFocusRevision,
    onHoverArtifacts,
    onRemoveRevision,
    sizeKey
  } = props;

  const matrix = comparator.toJSON();

  const handleMouseOut = React.useCallback(() => {
    onHoverArtifacts([]);
  }, [onHoverArtifacts]);

  const handleHoverArtifact = React.useCallback(
    (artifactName: string): void => {
      onHoverArtifacts(artifactName ? [artifactName] : emptyArray);
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

  const handleFocusArtifact = React.useCallback(
    (artifactName: string): void => {
      onFocusArtifacts([artifactName]);
    },
    [onFocusArtifacts]
  );

  return (
    <Table onMouseLeave={handleMouseOut} style={styles.table}>
      <Thead>
        <HeaderRow onFocusRevision={onFocusRevision} onRemoveRevision={onRemoveRevision} row={matrix.header} />
        {matrix.groups.map(row => {
          const { artifactNames, text: groupName } = row[0];
          const isActive = Object.keys(activeArtifacts)
            .filter(artifactName => artifactNames.includes(artifactName))
            .every(artifactName => activeArtifacts[artifactName]);
          return (
            <GroupRow
              isActive={isActive}
              key={groupName}
              onDisable={onDisableArtifacts}
              onEnable={onEnableArtifacts}
              onFocus={onFocusArtifacts}
              onHover={onHoverArtifacts}
              row={row}
              sizeKey={sizeKey}
            />
          );
        })}
      </Thead>
      <Tbody>
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
              onFocusArtifact={handleFocusArtifact}
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
