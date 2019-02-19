import * as Theme from '../theme';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle
} from 'react-native';

interface Props {
  children: React.ReactNode;
  disabled?: boolean;
  rippleColor: string | 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
}

interface State {
  locationX: number;
  locationY: number;
  showRipple: boolean;
}

class Ripple extends React.Component<Props & TouchableOpacityProps, State> {
  public static defaultProps = {
    disabled: false,
    rippleColor: 'rgba(0,0,0,0.2)'
  };

  public state = {
    locationX: 0,
    locationY: 0,
    showRipple: false
  };

  private _width = 0;
  private _height = 0;
  private _unmounted = false;

  public componentWillUnmount(): void {
    this._unmounted = true;
  }

  public render(): React.ReactNode {
    const { children, rippleColor, style, ...props } = this.props;
    const { locationX, locationY, showRipple } = this.state;
    const size = Math.max(this._width, this._height);
    const sizeMidpoint = size / 2;
    const offset = Math.max(Math.abs(locationX - sizeMidpoint), Math.abs(locationY - sizeMidpoint));
    const finalSize = size + offset * 2.5;
    return (
      // @ts-ignore annoying web-specific props
      <TouchableOpacity
        {...props}
        activeOpacity={1}
        // @ts-ignore
        onPressIn={this._handlePressIn}
        onPressOut={this._handlePressOut}
        style={styles.wrapper}
      >
        <View
          onLayout={this._handleLayout}
          style={[styles.root, style]}
          // @ts-ignore
          ref={this._receiveRootRef}
        >
          {children}
          <View
            style={[
              styles.ripple,
              { backgroundColor: rippleColor },
              showRipple ? { width: finalSize, height: finalSize } : null,
              showRipple ? styles.animateIn : styles.animateOut,
              {
                left: locationX - finalSize / 2,
                top: locationY - finalSize / 2
              }
            ]}
          >
            <View style={styles.adjuster} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  private _handleLayout = event => {
    this._width = event.nativeEvent.layout.width;
    this._height = event.nativeEvent.layout.height;
  };

  private _receiveRootRef = (ref: React.ReactElement<ViewProps>) => {
    if (ref && ref instanceof TouchableOpacity) {
      const element = ReactDOM.findDOMNode(ref);
      if (element && element instanceof HTMLElement) {
        /**
         * NOTE: this removes the box shadow, if set
         */
        element.style.webkitMaskImage =
          'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg==)';
      }
    }
  };

  private _handlePressIn = event => {
    const { disabled, onPressIn } = this.props;
    const { locationX, locationY } = event.nativeEvent;
    if (disabled) {
      return;
    }

    this.setState({
      locationX: Math.floor(locationX - window.scrollX),
      locationY: Math.floor(locationY - window.scrollY),
      showRipple: true
    });

    if (onPressIn) {
      onPressIn(event);
    }
  };

  private _handlePressOut = event => {
    const { disabled, onPressOut } = this.props;
    if (disabled) {
      return;
    }
    setTimeout(() => {
      !this._unmounted && this.setState({ showRipple: false });
    }, 400);
    if (onPressOut) {
      onPressOut(event);
    }
  };
}

const styles = StyleSheet.create({
  wrapper: {
    // @ts-ignore
    display: 'inline-flex'
  },
  root: {
    // @ts-ignore
    display: 'inline-flex',
    overflow: 'hidden',
    position: 'relative'
  },
  ripple: {
    position: 'absolute',
    borderRadius: 9999,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    zIndex: -1,
    opacity: 0,
    // @ts-ignore
    transitionProperty: 'transform, opacity',
    transitionDuration: '0.4s',
    transitionTimingFunction: Theme.MotionTiming.Standard,
    transformOrigin: '50% 50%',
    transform: [{ scale: 0 }]
  },

  adjuster: {
    // @ts-ignore
    display: 'block',
    paddingTop: '100%',
    height: 0,
    width: 0
  },

  animateIn: {
    opacity: 1,
    transform: [{ scale: 1 }]
  },

  animateOut: {
    // @ts-ignore
    animationName: [{ from: { opacity: 1 }, to: { opacity: 0 } }],
    animationDuration: '0.2s',
    animationIterationCount: 1,
    transitionDelay: '0.2s',
    transitionDuration: '0s',
    width: 0,
    height: 0,
    transform: [{ scale: 0 }],
    opacity: 0
  }
});

export default Ripple;
