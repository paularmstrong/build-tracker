/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ArtifactRow } from '@build-tracker/comparator';
import ClearIcon from '../icons/Clear';
import { Clipboard } from 'react-native';
import Divider from '../components/Divider';
import DocumentIcon from '../icons/Document';
import { Handles as DrawerHandles } from '../components/Drawer';
import LinkIcon from '../icons/Link';
import ListBulletedIcon from '../icons/ListBulleted';
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
  const disabledArtifactsVisible = useSelector((state: State) => state.disabledArtifactsVisible);
  const graphType = useSelector((state: State) => state.graphType);

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
        sizeKey,
      })
    );
    dispatch(addSnack('Copied table as markdown'));
    appBarRef.current.dismissOverflow();
  }, [activeComparator, artifactFilter, dispatch, sizeKey]);

  const handleCopyAsCsv = React.useCallback((): void => {
    Clipboard.setString(
      activeComparator.toCsv({
        artifactFilter,
        sizeKey,
      })
    );
    dispatch(addSnack('Copied table as CSV'));
    appBarRef.current.dismissOverflow();
  }, [activeComparator, artifactFilter, dispatch, sizeKey]);

  const handleCopyLink = React.useCallback((): void => {
    const url = new URL(window.location.href);
    url.pathname = `/builds/${comparedRevisions.join('/')}`;

    const params = new URLSearchParams();
    params.append('sizeKey', sizeKey);
    params.append('disabledArtifactsVisible', `${disabledArtifactsVisible}`);
    params.append('graphType', `${graphType}`);
    comparedRevisions.forEach((rev) => {
      params.append('comparedRevisions', rev);
    });
    if (Object.values(activeArtifacts).some((v) => !v)) {
      Object.entries(activeArtifacts).forEach(([artifactName, active]) => {
        if (active) {
          params.append('activeArtifacts', artifactName);
        }
      });
    }

    url.search = params.toString();
    Clipboard.setString(url.toString());
    dispatch(addSnack('Copied link to clipboard'));
    appBarRef.current.dismissOverflow();
  }, [activeArtifacts, comparedRevisions, disabledArtifactsVisible, dispatch, graphType, sizeKey]);

  const handleCopySummary = React.useCallback((): void => {
    Clipboard.setString(`${activeComparator.toSummary().join(' \n')}`);
    dispatch(addSnack('Copied summary'));
    appBarRef.current.dismissOverflow();
  }, [activeComparator, dispatch]);

  return (
    <AppBar
      navigationIcon={MenuIcon}
      onPressNavigationIcon={showDrawer}
      overflowItems={
        comparedRevisions.length ? (
          <>
            <MenuItem key="clear" icon={ClearIcon} label="Clear selected revisions" onPress={handleClearRevisions} />
            <Divider />
            <MenuItem key="summary" icon={ListBulletedIcon} label="Copy summary" onPress={handleCopySummary} />
            <MenuItem key="md" icon={TableIcon} label="Copy as markdown" onPress={handleCopyAsMarkdown} />
            <MenuItem key="csv" icon={DocumentIcon} label="Copy as CSV" onPress={handleCopyAsCsv} />
            <Divider />
            <MenuItem key="link" icon={LinkIcon} label="Copy link" onPress={handleCopyLink} />
          </>
        ) : null
      }
      ref={appBarRef}
      title={name}
    />
  );
};

export default AppBarView;
