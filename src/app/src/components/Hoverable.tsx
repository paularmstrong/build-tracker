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

const Hoverable = (props: Props): React.ReactElement => {
  const [isHovered, setHovered] = React.useState(false);

  const { children } = props;
  const child = typeof children === 'function' ? children(isHovered) : children;

  const _handleMouseEnter = (): void => {
    if (hover.isEnabled && !isHovered) {
      const { onHoverIn } = props;
      if (onHoverIn) {
        onHoverIn();
      }
      setHovered(true);
    }
  };

  const _handleMouseLeave = (): void => {
    if (isHovered) {
      const { onHoverOut } = props;
      if (onHoverOut) {
        onHoverOut();
      }
      setHovered(false);
    }
  };

  return React.cloneElement(React.Children.only(child), {
    onMouseEnter: _handleMouseEnter,
    onMouseLeave: _handleMouseLeave
  });
};

export default Hoverable;
