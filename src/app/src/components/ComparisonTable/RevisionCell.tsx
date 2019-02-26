/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import { RevisionCell as Cell } from '@build-tracker/comparator';
import { formatSha } from '@build-tracker/formatting';
import Hoverable from '../Hoverable';
import Menu from '../Menu';
import MenuItem from '../Menu/Item';
import React from 'react';
import { Th } from './Table';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface Props {
  cell: Cell;
  onRemove: (revision: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const RevisionCell = (props: Props): React.ReactElement => {
  const { cell, onRemove, style } = props;
  const contentRef = React.useRef(null);
  const [showMenu, toggleMenu] = React.useState(false);

  const handleToggleMenu = React.useCallback((): void => {
    toggleMenu(!showMenu);
  }, [showMenu, toggleMenu]);

  const handleRemove = React.useCallback((): void => {
    onRemove(cell.revision);
  }, [cell.revision, onRemove]);

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
              <Text>{formatSha(cell.revision)}</Text>
            </TouchableOpacity>
          </Th>
        )}
      </Hoverable>
      {showMenu ? (
        <Menu onDismiss={handleToggleMenu} relativeTo={contentRef}>
          <MenuItem label="Remove" onPress={handleRemove} />
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
  }
});

export default React.memo(RevisionCell);
