/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import AppBar from '../components/AppBar';
import { AppConfig } from '@build-tracker/types';
import Build from '@build-tracker/build';
import ColorScale from '../modules/ColorScale';
import Drawer from '../components/Drawer';
import DrawerView from '../views/Drawer';
import { fetch } from 'cross-fetch';
import Graph from '../components/Graph';
import MenuIcon from '../icons/Menu';
import MenuItem from '../components/MenuItem';
import React from 'react';
import { ScaleSequential } from 'd3-scale';
import Snackbar from '../components/Snackbar';
import { Clipboard, StyleSheet, View } from 'react-native';
import Comparator, { ArtifactRow } from '@build-tracker/comparator';

const Comparison = React.lazy(() => import(/* webpackChunkName: "Comparison" */ '../views/Comparison'));

interface Props {
  artifactConfig?: AppConfig['artifacts'];
  url: string;
}

const Main = (props: Props): React.ReactElement => {
  const { artifactConfig = {}, url } = props;
  const drawerRef: React.RefObject<Drawer> = React.useRef(null);
  const [compareRevisions, setCompareRevisions] = React.useState<Array<string>>([]);

  const [builds, setBuilds] = React.useState<Array<Build>>([]);
  const [sizeKey, setSizeKey] = React.useState<string>('');
  const [activeArtifacts, setActiveArtifacts] = React.useState<{ [key: string]: boolean }>({});
  React.useEffect(() => {
    fetch(`${url}/api/builds`)
      .then(response => response.json())
      .then(builds => {
        setBuilds(builds.map(buildStruct => new Build(buildStruct.meta, buildStruct.artifacts)));
      });
  }, [url]);

  const comparator = React.useMemo((): Comparator => {
    const comparator = new Comparator({ builds });
    setSizeKey(comparator.sizeKeys[0]);
    setActiveArtifacts(
      comparator.artifactNames.reduce((memo, artifactName) => {
        memo[artifactName] = true;
        return memo;
      }, {})
    );
    return comparator;
  }, [builds]);

  const activeComparator = React.useMemo(
    (): Comparator =>
      new Comparator({
        artifactBudgets: artifactConfig.budgets,
        builds: builds.filter(build => compareRevisions.indexOf(build.getMetaValue('revision')) !== -1),
        groups: artifactConfig.groups
      }),
    [artifactConfig.budgets, artifactConfig.groups, builds, compareRevisions]
  );

  const [colorScale, setColorScale] = React.useState<ScaleSequential<string>>(
    () => ColorScale[Object.keys(ColorScale)[0]]
  );
  const [focusedRevision, setFocusedRevision] = React.useState<string>(null);
  const [hoveredArtifacts, setHoveredArtifacts] = React.useState<Array<string>>([]);
  const [disabledArtifactsVisible, setDisabledArtifactsVisible] = React.useState<boolean>(true);

  const [messages, setMessages] = React.useState<Array<string>>([]);

  const [, forceUpdate] = React.useState(0);

  const showDrawer = React.useCallback((): void => {
    drawerRef.current && drawerRef.current.show();
  }, []);

  const handleSelectColorScale = React.useCallback((scale): void => {
    setColorScale(() => scale);
  }, []);

  const handleDisableArtifacts = React.useCallback((artifactNames: Array<string>): void => {
    setActiveArtifacts(activeArtifacts => {
      return Object.entries(activeArtifacts).reduce((memo, [artifactName, isActive]) => {
        memo[artifactName] = artifactNames.includes(artifactName) ? false : isActive;
        return memo;
      }, {});
    });
    forceUpdate(Date.now());
  }, []);

  const handleEnableArtifacts = React.useCallback((artifactNames: Array<string>): void => {
    setActiveArtifacts(activeArtifacts => {
      return Object.entries(activeArtifacts).reduce((memo, [artifactName, isActive]) => {
        memo[artifactName] = artifactNames.includes(artifactName) ? true : isActive;
        return memo;
      }, {});
    });
    forceUpdate(Date.now());
  }, []);

  const handleFocusArtifacts = React.useCallback((artifactNames: Array<string>): void => {
    setActiveArtifacts(activeArtifacts => {
      return Object.keys(activeArtifacts).reduce((memo, artifactName) => {
        memo[artifactName] = artifactNames.includes(artifactName) ? true : false;
        return memo;
      }, {});
    });
    forceUpdate(Date.now());
  }, []);

  const handleSelectSizeKey = React.useCallback((name: string): void => {
    setSizeKey(name);
    forceUpdate(Date.now());
  }, []);

  const handleSelectRevision = React.useCallback((revision: string): void => {
    setCompareRevisions(compareRevisions => [...compareRevisions, revision]);
  }, []);

  const handleClearRevisions = React.useCallback((): void => {
    setCompareRevisions([]);
    setFocusedRevision(null);
  }, []);

  const handleUnfocusRevision = React.useCallback((): void => {
    setFocusedRevision(null);
  }, []);

  const handleRemoveRevision = React.useCallback(
    (revision: string): void => {
      if (focusedRevision === revision) {
        setFocusedRevision(null);
      }
      setCompareRevisions(compareRevisions => compareRevisions.filter(r => r !== revision));
    },
    [focusedRevision]
  );

  const handleHoverArtifacts = React.useCallback(
    (newHovered: Array<string>): void => {
      const equal =
        newHovered.length === hoveredArtifacts.length &&
        newHovered.every(value => hoveredArtifacts.indexOf(value) !== -1);
      if (equal) {
        return;
      }
      setHoveredArtifacts(newHovered);
    },
    [hoveredArtifacts]
  );

  const handleToggleDisabledArtifacts = React.useCallback((showDisabled: boolean): void => {
    setDisabledArtifactsVisible(showDisabled);
  }, []);

  const artifactFilter = (row: ArtifactRow): boolean => {
    const artifactCell = row[0];
    return activeArtifacts[artifactCell.text];
  };

  const handleCopyAsMarkdown = React.useCallback((): void => {
    Clipboard.setString(
      activeComparator.toMarkdown({
        artifactFilter,
        sizeKey
      })
    );
    setMessages(messages => [...messages, 'Copied table as markdown'].filter(Boolean));
  }, [activeComparator, artifactFilter, sizeKey]);

  const handleCopyAsCsv = React.useCallback((): void => {
    Clipboard.setString(
      activeComparator.toCsv({
        artifactFilter,
        sizeKey
      })
    );
    setMessages(messages => [...messages, 'Copied table as CSV'].filter(Boolean));
  }, [activeComparator, artifactFilter, sizeKey]);

  React.useEffect(() => {
    if (messages.length) {
      setTimeout(() => {
        setMessages(messages => messages.slice(1));
      }, 4000);
    }
  }, [messages]);

  return (
    <View style={styles.layout}>
      <DrawerView
        colorScale={colorScale}
        comparator={comparator}
        disabledArtifactsVisible={disabledArtifactsVisible}
        onSelectColorScale={handleSelectColorScale}
        onSelectSizeKey={handleSelectSizeKey}
        onToggleDisabledArtifacts={handleToggleDisabledArtifacts}
        ref={drawerRef}
        sizeKey={sizeKey}
      />
      <View
        // @ts-ignore
        accessibilityRole="main"
        style={styles.main}
      >
        <View style={[styles.column, styles.chart]}>
          <AppBar
            navigationIcon={MenuIcon}
            onPressNavigationIcon={showDrawer}
            overflowItems={
              compareRevisions.length ? (
                <>
                  <MenuItem key="clear" label="Clear selected revisions" onPress={handleClearRevisions} />
                  <MenuItem key="md" label="Copy as markdown" onPress={handleCopyAsMarkdown} />
                  <MenuItem key="csv" label="Copy as CSV" onPress={handleCopyAsCsv} />
                </>
              ) : null
            }
            title="Build Tracker"
          />
          <Graph
            activeArtifacts={activeArtifacts}
            colorScale={colorScale}
            comparator={comparator}
            hoveredArtifacts={hoveredArtifacts}
            onHoverArtifacts={handleHoverArtifacts}
            onSelectRevision={handleSelectRevision}
            selectedRevisions={compareRevisions}
            sizeKey={sizeKey}
          />
        </View>
        {messages.length ? <Snackbar key={messages[0]} text={messages[0]} /> : null}
        {compareRevisions.length ? (
          <React.Suspense fallback={null}>
            <Comparison
              activeArtifacts={activeArtifacts}
              colorScale={colorScale}
              comparator={activeComparator}
              disabledArtifactsVisible={disabledArtifactsVisible}
              focusedRevision={focusedRevision}
              hoveredArtifacts={hoveredArtifacts}
              onDisableArtifacts={handleDisableArtifacts}
              onEnableArtifacts={handleEnableArtifacts}
              onFocusArtifacts={handleFocusArtifacts}
              onFocusRevision={setFocusedRevision}
              onUnfocusRevision={handleUnfocusRevision}
              onHoverArtifacts={handleHoverArtifacts}
              onRemoveRevision={handleRemoveRevision}
              sizeKey={sizeKey}
              style={[styles.column, styles.table]}
            />
          </React.Suspense>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    height: '100vh',
    overflow: 'hidden'
  },
  main: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: '100vh',
    width: '100vw'
  },
  column: {
    flexGrow: 3,
    flexShrink: 1,
    height: '100vh',
    alignItems: 'flex-start'
  },
  chart: {
    flexDirection: 'column'
  },
  table: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    maxWidth: '40vw',
    borderLeftColor: Theme.Color.Gray10,
    borderLeftWidth: StyleSheet.hairlineWidth
  }
});

export default Main;
