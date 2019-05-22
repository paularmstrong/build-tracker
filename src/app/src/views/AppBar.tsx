/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ArtifactRow } from '@build-tracker/comparator';
import { Clipboard } from 'react-native';
import Drawer from '../components/Drawer';
import MenuIcon from '../icons/Menu';
import MenuItem from '../components/MenuItem';
import React from 'react';
import { State } from '../store/types';
import { addSnack, clearComparedRevisions } from '../store/actions';
import AppBar, { Handles as AppBarHandles } from '../components/AppBar';
import { useDispatch, useMappedState } from 'redux-react-hook';

interface MappedState {
  activeComparator: State['activeComparator'];
  activeArtifacts: State['activeArtifacts'];
  comparator: State['comparator'];
  comparedRevisions: State['comparedRevisions'];
  sizeKey: string;
  url: string;
}

const mapState = (state: State): MappedState => {
  return {
    activeComparator: state.activeComparator,
    activeArtifacts: state.activeArtifacts,
    comparator: state.comparator,
    comparedRevisions: state.comparedRevisions,
    sizeKey: state.sizeKey || state.comparator.sizeKeys[0],
    url: state.url
  };
};

const AppBarView = (props: { drawerRef: React.RefObject<Drawer> }): React.ReactElement => {
  const { drawerRef } = props;
  const { activeArtifacts, activeComparator, comparedRevisions, sizeKey } = useMappedState(mapState);
  const dispatch = useDispatch();

  const appBarRef = React.useRef<AppBarHandles>(null);

  const showDrawer = React.useCallback((): void => {
    drawerRef.current && drawerRef.current.show();
  }, [drawerRef]);

  const handleClearRevisions = React.useCallback((): void => {
    dispatch(clearComparedRevisions());
    appBarRef.current.dismissOverflow();
  }, [dispatch]);

  const artifactFilter = React.useCallback(
    (row: ArtifactRow): boolean => {
      const artifactCell = row[0];
      return activeArtifacts[artifactCell.text];
    },
    [activeArtifacts]
  );

  const handleCopyAsMarkdown = React.useCallback((): void => {
    Clipboard.setString(
      activeComparator.toMarkdown({
        artifactFilter,
        sizeKey
      })
    );
    dispatch(addSnack('Copied table as markdown'));
    appBarRef.current.dismissOverflow();
  }, [activeComparator, artifactFilter, dispatch, sizeKey]);

  const handleCopyAsCsv = React.useCallback((): void => {
    Clipboard.setString(
      activeComparator.toCsv({
        artifactFilter,
        sizeKey
      })
    );
    dispatch(addSnack('Copied table as CSV'));
    appBarRef.current.dismissOverflow();
  }, [activeComparator, artifactFilter, dispatch, sizeKey]);

  return (
    <AppBar
      navigationIcon={MenuIcon}
      onPressNavigationIcon={showDrawer}
      overflowItems={
        comparedRevisions.length ? (
          <>
            <MenuItem key="clear" label="Clear selected revisions" onPress={handleClearRevisions} />
            <MenuItem key="md" label="Copy as markdown" onPress={handleCopyAsMarkdown} />
            <MenuItem key="csv" label="Copy as CSV" onPress={handleCopyAsCsv} />
          </>
        ) : null
      }
      ref={appBarRef}
      title="Build Tracker"
    />
  );
};

export default AppBarView;
