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

  const handleCopyLink = React.useCallback((): void => {
    const params = new URLSearchParams();
    params.append('sizeKey', sizeKey);
    params.append('disabledArtifactsVisible', `${disabledArtifactsVisible}`);
    comparedRevisions.forEach(rev => {
      params.append('comparedRevisions', rev);
    });
    if (Object.values(activeArtifacts).some(v => !v)) {
      Object.entries(activeArtifacts).forEach(([artifactName, active]) => {
        if (active) {
          params.append('activeArtifacts', artifactName);
        }
      });
    }

    const newUrl = new URL(window.location.href);
    newUrl.search = params.toString();
    Clipboard.setString(newUrl.toString());
    dispatch(addSnack('Copied link to clipboard'));
    appBarRef.current.dismissOverflow();
  }, [disabledArtifactsVisible, dispatch, sizeKey, activeArtifacts, comparedRevisions]);

  return (
    <AppBar
      navigationIcon={MenuIcon}
      onPressNavigationIcon={showDrawer}
      overflowItems={
        comparedRevisions.length ? (
          <>
            <MenuItem key="clear" icon={ClearIcon} label="Clear selected revisions" onPress={handleClearRevisions} />
            <Divider />
            <MenuItem key="md" icon={TableIcon} label="Copy as markdown" onPress={handleCopyAsMarkdown} />
            <MenuItem key="csv" icon={DocumentIcon} label="Copy as CSV" onPress={handleCopyAsCsv} />
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
