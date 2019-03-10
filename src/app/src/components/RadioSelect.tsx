/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import React from 'react';
import Ripple from './Ripple';
import { createElement, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  disabled?: boolean;
  labelledBy?: string;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onValueChange?: (checked: boolean) => void;
  style?: StyleProp<ViewStyle>;
  value: boolean;
}

const RadioSelect = (props: Props): React.ReactElement => {
  const { disabled, labelledBy, onBlur, onFocus, onValueChange, style, value } = props;

  const [isFocused, setFocus] = React.useState(false);

  const handleBlur = React.useCallback(
    (event): void => {
      setFocus(false);
      onBlur && onBlur(event);
    },
    [onBlur]
  );

  const handleFocus = React.useCallback(
    (event): void => {
      setFocus(true);
      onFocus && onFocus(event);
    },
    [onFocus]
  );

  const handleChange = React.useCallback(
    (event): void => {
      onValueChange && onValueChange(event.nativeEvent.target.checked);
    },
    [onValueChange]
  );

  return (
    <Ripple rippleColor={Theme.Color.Primary00} style={[styles.root, style]}>
      <View>
        <View style={[styles.radio, isFocused && styles.focused]} testID="fauxRadio">
          {value ? <View pointerEvents="none" style={[styles.checked, isFocused && styles.checkedFocused]} /> : null}
        </View>
        {createElement('input', {
          'aria-labelledby': labelledBy,
          checked: value,
          disabled: disabled,
          onBlur: handleBlur,
          onChange: handleChange,
          onFocus: handleFocus,
          role: 'checkbox',
          style: [styles.native],
          type: 'checkbox'
        })}
      </View>
    </Ripple>
  );
};

const styles = StyleSheet.create({
  root: {
    borderRadius: Theme.BorderRadius.Infinite,
    padding: Theme.Spacing.Xsmall
  },
  radio: {
    borderRadius: Theme.BorderRadius.Infinite,
    borderWidth: 2,
    borderColor: Theme.Color.Gray30,
    borderStyle: 'solid',
    width: Theme.FontSize.Medium,
    height: Theme.FontSize.Medium,
    justifyContent: 'center',
    alignItems: 'center'
  },
  focused: {
    borderColor: Theme.Color.Primary30
  },
  checked: {
    borderRadius: Theme.BorderRadius.Infinite,
    backgroundColor: Theme.Color.Gray30,
    width: Theme.FontSize.Small,
    height: Theme.FontSize.Small
  },
  checkedFocused: {
    backgroundColor: Theme.Color.Primary30
  },
  native: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    margin: 0,
    opacity: 0,
    padding: 0,
    width: '100%'
  }
});

export default RadioSelect;
