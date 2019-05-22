/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import { RevisionCell as Cell } from '@build-tracker/comparator';
import { formatSha } from '@build-tracker/formatting';
import Hoverable from '../Hoverable';
import InfoIcon from '../../icons/Info';
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import React from 'react';
import RemoveIcon from '../../icons/Remove';
import { Th } from '../Table';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  onFocus: (revision: string) => void;
  onRemove: (revision: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const RevisionCell = (props: Props): React.ReactElement => {
  const { cell, onFocus, onRemove, style } = props;
  const contentRef = React.useRef(null);
  const [showMenu, toggleMenu] = React.useState(false);

  const handleToggleMenu = React.useCallback((): void => {
    toggleMenu(showMenu => !showMenu);
  }, []);

  const handleRemove = React.useCallback((): void => {
    onRemove(cell.revision);
    handleToggleMenu();
  }, [cell.revision, handleToggleMenu, onRemove]);

  const handleFocus = React.useCallback((): void => {
    onFocus(cell.revision);
    handleToggleMenu();
  }, [cell.revision, handleToggleMenu, onFocus]);

  return (
    <>
      <Hoverable>
        {isHovered => (
          <Th style={[style, isHovered && styles.hovered]}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleToggleMenu}
              ref={contentRef}
              style={styles.content}
            >
              <Text style={styles.revision}>{formatSha(cell.revision)}</Text>
            </TouchableOpacity>
          </Th>
        )}
      </Hoverable>
      {showMenu ? (
        <Menu onDismiss={handleToggleMenu} relativeTo={contentRef}>
          <MenuItem icon={InfoIcon} label="More info" onPress={handleFocus} />
          <MenuItem icon={RemoveIcon} label="Remove" onPress={handleRemove} />
        </Menu>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  hovered: {
    backgroundColor: Theme.Color.Primary00
  },
  content: {
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  revision: {
    fontWeight: 'bold'
  }
});

export default React.memo(RevisionCell);
