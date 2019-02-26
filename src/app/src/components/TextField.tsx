/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import Hoverable from './Hoverable';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';

interface Props extends React.ComponentProps<typeof TextInput> {
  forwardedRef?: React.Ref<TextInput>;
  helpText?: string;
  label: string;
  leadingIcon?: React.ComponentType<{ style?: StyleProp<ViewStyle> }>;
  trailingIcon?: React.ComponentType<{ style?: StyleProp<ViewStyle> }>;
  type?: 'filled' | 'shapedFilled' | 'outlined' | 'shapedOutlined' | 'textarea';
}

interface State {
  isFocused: boolean;
  value: string;
}

class TextField extends React.PureComponent<Props, State> {
  public static defaultProps = {
    type: 'filled',
    value: ''
  };

  public state = {
    isFocused: false,
    value: ''
  };

  public static getDerivedStateFromProps(props, state): Partial<State> {
    return { value: props.value || state.value };
  }

  public render(): React.ReactElement {
    const {
      forwardedRef,
      helpText,
      label,
      leadingIcon: LeadingIcon,
      style,
      trailingIcon: TrailingIcon,
      type, // eslint-disable-line
      ...textinputprops
    } = this.props;
    const { isFocused, value } = this.state;
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
                    {...textinputprops}
                    onBlur={this._handleBlur}
                    onChangeText={this._handleChange}
                    onFocus={this._handleFocus}
                    ref={forwardedRef}
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
  }

  private _handleFocus = event => {
    this.setState({ isFocused: true });
    this.props.onFocus && this.props.onFocus(event);
  };

  private _handleBlur = event => {
    this.setState({ isFocused: false });
    this.props.onBlur && this.props.onBlur(event);
  };

  private _handleChange = value => {
    this.setState({ value });
    this.props.onChangeText && this.props.onChangeText(value);
  };
}

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
    backgroundColor: Theme.Color.Gray20,
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
    backgroundColor: Theme.Color.Gray30
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
    outline: 'none'
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

export default React.forwardRef<TextInput, Props>((props, ref) => (
  <TextField {...props} forwardedRef={ref ? ref : undefined} />
));
