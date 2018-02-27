// @flow
import React, { Component } from 'react';

/**
 * Touch devices emulate mouse events. This functions makes it possible to know
 * if the current modality supports hover (including for multi-modality
 * devices).
 */
const createHoverMonitor = () => {
  let isHoverEnabled = false;
  let lastTouchTime = 0;

  function enableHover() {
    if (isHoverEnabled || Date.now() - lastTouchTime < 500) {
      return;
    }
    isHoverEnabled = true;
  }

  function disableHover() {
    lastTouchTime = new Date();
    if (isHoverEnabled) {
      isHoverEnabled = false;
    }
  }

  if (typeof window !== 'undefined' && window.document) {
    document.addEventListener('touchstart', disableHover, true);
    document.addEventListener('mousemove', enableHover, true);
  }

  return {
    get isEnabled() {
      return isHoverEnabled;
    }
  };
};

const hover = createHoverMonitor();

type Props = {
  children: React$Node | ((isHovered: boolean) => React$Node),
  onHoverIn?: () => void,
  onHoverOut?: () => void
};

type State = {
  isHovered: boolean
};

class Hoverable extends Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = { isHovered: false };
  }

  _handleMouseEnter = (event: SyntheticMouseEvent<EventTarget>) => {
    if (hover.isEnabled && !this.state.isHovered) {
      const { onHoverIn } = this.props;
      if (onHoverIn) {
        onHoverIn();
      }
      this.setState({ isHovered: true });
    }
  };

  _handleMouseLeave = (event: SyntheticMouseEvent<EventTarget>) => {
    if (this.state.isHovered) {
      const { onHoverOut } = this.props;
      if (onHoverOut) {
        onHoverOut();
      }
      this.setState({ isHovered: false });
    }
  };

  render() {
    const { children } = this.props;

    const child = typeof children === 'function' ? children(this.state.isHovered) : children;

    return React.cloneElement(React.Children.only(child), {
      onMouseEnter: this._handleMouseEnter,
      onMouseLeave: this._handleMouseLeave
    });
  }
}

export default Hoverable;
