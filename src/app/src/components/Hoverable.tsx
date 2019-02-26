/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';

interface Monitor {
  isEnabled: boolean;
}

/**
 * Touch devices emulate mouse events. This functions makes it possible to know
 * if the current modality supports hover (including for multi-modality
 * devices).
 */
const createHoverMonitor = (): Monitor => {
  let isHoverEnabled = false;
  let lastTouchTime = 0;

  function enableHover(): void {
    if (isHoverEnabled || Date.now() - lastTouchTime < 500) {
      return;
    }
    isHoverEnabled = true;
  }

  function disableHover(): void {
    lastTouchTime = Date.now();
    if (isHoverEnabled) {
      isHoverEnabled = false;
    }
  }

  if (canUseDOM) {
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

interface Props {
  children: React.ReactNode;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
}

interface State {
  isHovered: boolean;
}

class Hoverable extends React.Component<Props, State> {
  public state = { isHovered: false };

  public render(): React.ReactElement {
    const { children } = this.props;
    const { isHovered } = this.state;
    const child = typeof children === 'function' ? children(isHovered) : children;

    return React.cloneElement(React.Children.only(child), {
      onMouseEnter: this._handleMouseEnter,
      onMouseLeave: this._handleMouseLeave
    });
  }

  private _handleMouseEnter = (): void => {
    const { isHovered } = this.state;
    if (hover.isEnabled && !isHovered) {
      const { onHoverIn } = this.props;
      if (onHoverIn) {
        onHoverIn();
      }
      this.setState({ isHovered: true });
    }
  };

  private _handleMouseLeave = (): void => {
    const { isHovered } = this.state;
    if (isHovered) {
      const { onHoverOut } = this.props;
      if (onHoverOut) {
        onHoverOut();
      }
      this.setState({ isHovered: false });
    }
  };
}

export default Hoverable;
