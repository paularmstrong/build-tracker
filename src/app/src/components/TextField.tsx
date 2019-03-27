/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import Hoverable from './Hoverable';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';

interface Props extends React.ComponentProps<typeof TextInput> {
  helpText?: string;
  label: string;
  leadingIcon?: React.ComponentType<{ style?: StyleProp<ViewStyle> }>;
  trailingIcon?: React.ComponentType<{ style?: StyleProp<ViewStyle> }>;
}

const TextField = (props: Props, ref?: React.RefObject<TextInput>): React.ReactElement => {
  const {
    helpText,
    label,
    leadingIcon: LeadingIcon,
    onBlur,
    onChangeText,
    onFocus,
    style,
    trailingIcon: TrailingIcon,
    value: propValue,
    ...textInputProps
  } = props;
  const [isFocused, setFocused] = React.useState(false);
  const [value, setValue] = React.useState(props.value || '');

  const handleFocus = React.useCallback(
    (event): void => {
      setFocused(true);
      onFocus && onFocus(event);
    },
    [onFocus]
  );

  const handleBlur = React.useCallback(
    (event): void => {
      setFocused(false);
      onBlur && onBlur(event);
    },
    [onBlur]
  );

  const handleChange = React.useCallback(
    value => {
      setValue(value);
      onChangeText && onChangeText(value);
    },
    [onChangeText, setValue]
  );

  if (propValue !== value) {
    setValue(propValue);
  }

  const labelMoved = isFocused || value !== '';

  return (
    <Hoverable>
      {isHovered => (
        <View style={[styles.root, style]}>
          <View style={[styles.content, isFocused && styles.contentFocused]}>
            <View
              // @ts-ignore
              accessibilityRole="label"
              style={[styles.labelBox, !isFocused && isHovered && styles.labelBoxHovered]}
            >
              {LeadingIcon ? <LeadingIcon style={[styles.icon, styles.leadingIcon]} /> : null}
              <View style={styles.labelInput}>
                <View style={[styles.label, labelMoved && styles.labelMoved]}>
                  <Text style={[styles.labelText, labelMoved && styles.labelTextMoved]}>{label}</Text>
                </View>
                <TextInput
                  {...textInputProps}
                  onBlur={handleBlur}
                  onChangeText={handleChange}
                  onFocus={handleFocus}
                  ref={ref}
                  style={styles.textInput}
                  value={value}
                />
              </View>
              {TrailingIcon ? <TrailingIcon style={[styles.icon, styles.trailingIcon]} /> : null}
            </View>
          </View>
          {helpText ? <Text style={styles.helpText}>{helpText}</Text> : null}
        </View>
      )}
    </Hoverable>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex'
  },

  content: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.Color.Gray50,
    // @ts-ignore
    transitionProperty: 'border-bottom-color',
    transitionDuration: '0.1s'
  },

  contentFocused: {
    borderBottomColor: Theme.Color.Primary40
  },

  labelBox: {
    backgroundColor: Theme.Color.Gray10,
    borderTopLeftRadius: Theme.BorderRadius.Normal,
    borderTopRightRadius: Theme.BorderRadius.Normal,
    flexDirection: 'row',
    paddingHorizontal: Theme.Spacing.Normal,
    alignContent: 'stretch',
    display: 'flex',
    // @ts-ignore
    transitionProperty: 'background-color',
    transitionDuration: '0.1s'
  },

  labelBoxHovered: {
    backgroundColor: Theme.Color.Gray20
  },

  labelInput: {
    // @ts-ignore
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1
  },

  textInput: {
    paddingTop: '1.65rem',
    paddingBottom: '0.85rem',
    // @ts-ignore
    outlineStyle: 'none'
  },

  helpText: {
    paddingHorizontal: Theme.Spacing.Normal,
    fontSize: Theme.FontSize.Xsmall
  },

  label: {
    // @ts-ignore
    transitionProperty: 'transform',
    transitionDuration: '0.1s',
    // @ts-ignore
    position: 'absolute',
    paddingVertical: '1.25rem'
  },

  labelMoved: {
    // @ts-ignore
    transform: [{ translateY: '-0.8rem' }]
  },

  labelText: {
    // @ts-ignore
    transitionProperty: 'color font-size',
    // @ts-ignore
    transitionDuration: '0.1s',
    color: Theme.Color.Gray50
  },

  // @ts-ignore
  labelTextMoved: {
    fontSize: Theme.FontSize.Xsmall,
    color: Theme.Color.Primary40
  },

  icon: {
    color: Theme.Color.Gray50,
    marginVertical: '1.25rem',
    flexGrow: 0,
    fontSize: Theme.FontSize.Normal
  },

  leadingIcon: {
    marginEnd: Theme.Spacing.Xsmall
  },
  trailingIcon: {
    marginStart: Theme.Spacing.Xsmall
  }
});

export default React.forwardRef<TextInput, Props>(TextField);
