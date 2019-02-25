import * as Theme from '../../theme';
import Hoverable from '../Hoverable';
import React from 'react';
import Ripple from '../Ripple';
import { ScaleSequential } from 'd3-scale';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
  boxes: number;
  isSelected: boolean;
  name: string;
  onSelect: (scale: ScaleSequential<string>) => void;
  scale: ScaleSequential<string>;
  style?: StyleProp<ViewStyle>;
}

export const ColorScale = (props: Props): React.ReactElement => {
  const { boxes, isSelected, name, onSelect, scale, style } = props;

  const colorScale = scale.domain([0, boxes]);
  const handlePress = React.useCallback((): void => {
    onSelect(scale);
  }, [onSelect, scale]);

  return (
    <Hoverable>
      {isHovered => (
        // @ts-ignore annoying web-specific props
        <Ripple
          accessibilityRole="button"
          aria-selected={isSelected}
          onPress={handlePress}
          rippleColor={Theme.Color.Primary05}
          style={[styles.root, isSelected && styles.selected, isHovered && styles.hovered, style]}
        >
          <Text style={styles.name}>{name}</Text>
          <View style={[styles.scale, isHovered && styles.scaleHovered]}>
            {new Array(boxes).fill(0).map(
              (_, i): React.ReactElement => (
                <View key={i} pointerEvents="none" style={[styles.box, { backgroundColor: colorScale(i) }]} />
              )
            )}
          </View>
        </Ripple>
      )}
    </Hoverable>
  );
};

const styles = StyleSheet.create({
  root: {
    cursor: 'pointer',
    flexDirection: 'column',
    paddingHorizontal: Theme.Spacing.Xxsmall,
    paddingBottom: Theme.Spacing.Xxsmall
  },
  selected: {
    backgroundColor: Theme.Color.Primary00
  },
  hovered: {},
  name: {
    color: Theme.TextColor.White,
    marginBottom: Theme.Spacing.Xxsmall
  },
  scale: {
    flexDirection: 'row',
    opacity: 0.6,
    transitionProperty: 'opacity',
    transitionDuration: '0.1s'
  },
  scaleHovered: {
    opacity: 1
  },
  box: {
    flexGrow: 1,
    height: Theme.Spacing.Large,
    width: 'auto'
  }
});

export default ColorScale;
