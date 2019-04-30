/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import Hoverable from './Hoverable';
import React from 'react';
import Ripple from './Ripple';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface Props {
  accessibilityLabel?: string;
  color?: 'primary' | 'secondary';
  disabled?: boolean;
  icon?: React.ComponentType<{ style?: StyleProp<ViewStyle> }>;
  iconOnly?: boolean;
  onPress?: (event: MouseEvent) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  title: string;
  type?: 'text' | 'raised' | 'unelevated' | 'outlined' | 'shape' | 'shapeRaised';
}

const Button = (props: Props): React.ReactElement => {
  const [isActive, setIsActive] = React.useState(false);
  const {
    accessibilityLabel,
    color = 'primary',
    disabled = false,
    icon: Icon,
    iconOnly,
    onPress,
    style,
    title,
    type = 'text'
  } = props;
  const rippleColor =
    ['outlined', 'text'].indexOf(type) !== -1
      ? Theme.Color.Gray30
      : color === 'primary'
      ? Theme.Color.Primary20
      : Theme.Color.Secondary20;

  const _getRootStyles = (isHovered: boolean): Array<StyleProp<ViewStyle>> => _getStyles(rootStyles, isHovered);
  const _getTextStyles = (isHovered: boolean): Array<StyleProp<TextStyle>> => _getStyles(textStyles, isHovered);
  const _getIconStyles = (isHovered: boolean): Array<StyleProp<ViewStyle>> => _getStyles(iconStyles, isHovered);
  const _getStyles = (
    styles: typeof rootStyles | typeof textStyles,
    isHovered: boolean
  ): Array<StyleProp<ViewStyle | TextStyle>> => {
    const isRaised = ['raised', 'shapeRaised'].indexOf(type) !== -1;
    const isBg = ['raised', 'unelevated', 'shape', 'shapeRaised'].indexOf(type) !== -1;

    return [
      styles[type],
      !disabled && isHovered && styles.rootHover,
      !disabled && isActive && styles.rootActive,
      styles[color],
      disabled && styles[`${color}Disabled`],
      isRaised && styles.raised,
      isRaised && styles[`raised${color}`],
      isBg && styles.bg,
      isBg && styles[`bg${color}`],
      styles[`${type}${color}`],
      !disabled && isHovered && styles[`${type}Hover`],
      !disabled && isHovered && styles[`${type}${color}Hover`],
      !disabled && isHovered && isRaised && styles['raisedHover'],
      !disabled && isHovered && isRaised && styles[`raised${color}Hover`],
      !disabled && isHovered && isBg && styles['bgHover'],
      !disabled && isHovered && isBg && styles[`bg${color}Hover`],
      !disabled && isActive && styles[`${type}Active`],
      !disabled && isActive && styles[`${type}${color}Active`],
      !disabled && isActive && isRaised && styles['raisedActive'],
      !disabled && isActive && isRaised && styles[`raised${color}Active`]
    ];
  };

  const _handlePress = React.useCallback(
    (event): void => {
      if (disabled) {
        return;
      }
      onPress && onPress(event);
    },
    [disabled, onPress]
  );

  const _handlePressIn = React.useCallback(() => {
    setIsActive(true);
  }, []);

  const _handlePressOut = React.useCallback(() => {
    setIsActive(false);
  }, []);

  return (
    <Hoverable>
      {isHovered => (
        // @ts-ignore annoying web-specific props
        <Ripple
          accessibilityLabel={accessibilityLabel || title}
          accessibilityRole="button"
          disabled={disabled}
          onPress={_handlePress}
          onPressIn={_handlePressIn}
          onPressOut={_handlePressOut}
          rippleColor={rippleColor}
          style={[
            rootStyles.root,
            ..._getRootStyles(isHovered),
            iconOnly && type === 'text' && rootStyles.shape,
            style
          ]}
        >
          <View pointerEvents="none" style={[rootStyles.content, iconOnly && rootStyles.contentIconOnly]}>
            <Text style={[textStyles.root, ..._getTextStyles(isHovered)]}>
              {Icon ? (
                <Icon style={[iconOnly ? iconStyles.iconOnly : iconStyles.withText, ..._getIconStyles(isHovered)]} />
              ) : null}
              {iconOnly ? null : title}
            </Text>
          </View>
        </Ripple>
      )}
    </Hoverable>
  );
};

const rootStyles = StyleSheet.create({
  root: {
    // @ts-ignore
    display: 'inline-flex',
    borderRadius: Theme.BorderRadius.Normal,
    boxSizing: 'border-box',
    transitionProperty: 'background-color, box-shadow, border-color',
    transitionDuration: '0.2s, 0.2s, 0.2s',
    transitionTimingFunction: Theme.MotionTiming.Standard,
    height: '100%',
    position: 'relative'
  },

  iconOnly: {
    flexShrink: 0
  },

  content: {
    flexDirection: 'row',
    height: '2.5rem',
    paddingHorizontal: Theme.Spacing.Normal,
    alignItems: 'center',
    justifyContent: 'center'
  },

  contentIconOnly: {
    width: '2.5rem',
    paddingHorizontal: Theme.Spacing.None
  },

  rootHover: {
    backgroundColor: 'rgba(0,0,0,0.1)'
  },

  outlined: {
    borderWidth: 2,
    borderColor: Theme.Color.Primary40
  },
  outlinedHover: {
    borderColor: Theme.Color.Primary60
  },
  outlinedActive: {
    borderColor: Theme.Color.Primary10
  },
  outlinedsecondary: {
    borderColor: Theme.Color.Secondary40
  },
  outlinedsecondaryHover: {
    borderColor: Theme.Color.Secondary60
  },
  outlinedsecondaryActive: {
    borderColor: Theme.Color.Secondary10
  },

  raised: {
    shadowOffset: { width: 0, height: 2 },
    shadowColor: Theme.Color.Black,
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  raisedHover: {
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10
  },
  raisedActive: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3
  },

  shape: {
    borderRadius: Theme.BorderRadius.Infinite
  },
  shapeRaised: {
    borderRadius: Theme.BorderRadius.Infinite
  },

  // Primary40 colors
  bgprimary: {
    backgroundColor: Theme.Color.Primary40
  },
  bgprimaryHover: {
    backgroundColor: Theme.Color.Primary30
  },

  // Secondary40colors
  bgsecondary: {
    backgroundColor: Theme.Color.Secondary40
  },
  bgsecondaryHover: {
    backgroundColor: Theme.Color.Secondary30
  }
});

const textStyles = StyleSheet.create({
  root: {
    fontWeight: '500',
    color: Theme.TextColor.White,
    textTransform: 'uppercase'
  },

  primary: {
    color: Theme.Color.Primary40
  },
  primaryDisabled: {
    color: Theme.Color.Gray30
  },
  secondary: {
    color: Theme.Color.Secondary40
  },
  secondaryDisabled: {
    color: Theme.Color.Gray30
  },

  bgprimary: {
    color: Theme.TextColor.Primary40
  },

  bgsecondary: {
    color: Theme.TextColor.Secondary40
  }
});

const iconStyles = StyleSheet.create({
  withText: {
    marginEnd: '0.5rem',
    marginStart: '-0.25rem'
  },

  // @ts-ignore
  iconOnly: {
    fontSize: Theme.FontSize.Medium
  },

  primary: {
    color: Theme.Color.Primary40
  },
  primaryDisabled: {
    color: Theme.Color.Gray30
  },
  secondary: {
    color: Theme.Color.Secondary40
  },
  secondaryDisabled: {
    color: Theme.Color.Gray30
  },

  bgprimary: {
    color: Theme.TextColor.Primary40
  },

  bgsecondary: {
    color: Theme.TextColor.Secondary40
  }
});

export default Button;
