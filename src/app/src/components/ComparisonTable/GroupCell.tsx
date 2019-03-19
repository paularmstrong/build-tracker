/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import FolderIcon from '../../icons/Folder';
import { GroupCell as GCell } from '@build-tracker/comparator';
import Hoverable from '../Hoverable';
import React from 'react';
import { Th } from '../Table';
import Tooltip from '../Tooltip';
import { StyleProp, StyleSheet, Switch, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Props {
  cell: GCell;
  disabled?: boolean;
  isActive: boolean;
  onDisable: (artifactNames: Array<string>) => void;
  onEnable: (artifactNames: Array<string>) => void;
  onFocus: (artifactNames: Array<string>) => void;
  style?: StyleProp<ViewStyle>;
}

export const GroupCell = (props: Props): React.ReactElement => {
  const {
    cell: { artifactNames, text },
    disabled,
    isActive,
    onDisable,
    onEnable,
    onFocus,
    style
  } = props;

  const nameRef = React.useRef<View>(null);
  const [showTooltip, setShowTooltip] = React.useState(false);

  const handleValueChange = React.useCallback(
    (toggled: boolean): void => {
      toggled ? onEnable(artifactNames) : onDisable(artifactNames);
    },
    [artifactNames, onDisable, onEnable]
  );

  const handleToggleTooltip = React.useCallback(() => {
    setShowTooltip(showTooltip => !showTooltip);
  }, []);

  const handleFocus = React.useCallback(() => {
    onFocus(artifactNames);
  }, [artifactNames, onFocus]);

  return (
    <Th style={style}>
      <View style={styles.artifact}>
        <Hoverable>
          {isHovered => (
            <TouchableOpacity accessibilityRole="button" onPress={handleFocus} style={styles.name}>
              <View ref={nameRef}>
                <Text style={isHovered && styles.hoveredText}>
                  {
                    // @ts-ignore
                    <FolderIcon
                      onMouseEnter={handleToggleTooltip}
                      onMouseLeave={handleToggleTooltip}
                      style={[styles.folder, isHovered && styles.hoveredText]}
                      testID="groupicon"
                    />
                  }{' '}
                  {text}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </Hoverable>
        {showTooltip ? <Tooltip relativeTo={nameRef} text={`${artifactNames.join(', ')}`} /> : null}
        <View style={styles.switch}>
          {
            // @ts-ignore
            <Switch
              activeThumbColor={Theme.Color.Primary30}
              activeTrackColor={Theme.Color.Primary00}
              disabled={disabled}
              onValueChange={handleValueChange}
              value={isActive}
            />
          }
        </View>
      </View>
    </Th>
  );
};

const styles = StyleSheet.create({
  artifact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Theme.Spacing.Xxsmall
  },
  name: {
    flexShrink: 1,
    flexGrow: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingEnd: Theme.Spacing.Xsmall
  },
  folder: {
    color: Theme.Color.Gray40
  },
  switch: {
    paddingStart: Theme.Spacing.Xsmall
  },
  hoveredText: {
    color: Theme.Color.Primary30
  }
});

export default React.memo(GroupCell);
