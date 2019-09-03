/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ArtifactRow } from '@build-tracker/comparator';
import ClearIcon from '../icons/Clear';
import { Clipboard } from 'react-native';
import DocumentIcon from '../icons/Document';
import { Handles as DrawerHandles } from '../components/Drawer';
import MenuIcon from '../icons/Menu';
import MenuItem from '../components/MenuItem';
import React from 'react';
import { State } from '../store/types';
import TableIcon from '../icons/Table';
import { addSnack, clearComparedRevisions } from '../store/actions';
import AppBar, { Handles as AppBarHandles } from '../components/AppBar';
import { useDispatch, useSelector } from 'react-redux';

const AppBarView = (props: { drawerRef: React.RefObject<DrawerHandles> }): React.ReactElement => {
  const { drawerRef } = props;
  const activeComparator = useSelector((state: State) => state.activeComparator);
  const activeArtifacts = useSelector((state: State) => state.activeArtifacts);
  const comparedRevisions = useSelector((state: State) => state.comparedRevisions);
  const name = useSelector((state: State) => state.name);
  const sizeKey = useSelector((state: State) => state.sizeKey || state.comparator.sizeKeys[0]);
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
            <MenuItem key="clear" icon={ClearIcon} label="Clear selected revisions" onPress={handleClearRevisions} />
            <MenuItem key="md" icon={DocumentIcon} label="Copy as markdown" onPress={handleCopyAsMarkdown} />
            <MenuItem key="csv" icon={TableIcon} label="Copy as CSV" onPress={handleCopyAsCsv} />
          </>
        ) : null
      }
      ref={appBarRef}
      title={name}
    />
  );
};

export default AppBarView;
