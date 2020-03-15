/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import Tooltip from './Tooltip';
import { View } from 'react-native';

interface Props {
  relativeTo: React.RefObject<View>;
  text: string;
}

const RelativeTooltip = (props: Props): React.ReactElement => {
  const { relativeTo, text } = props;
  const [position, setPosition] = React.useState({ top: -999, left: 0 });

  React.useEffect(() => {
    let mounted = true;
    if (relativeTo.current) {
      relativeTo.current.measureInWindow(
        (x: number, y: number, width: number, height: number): void => {
          if (!mounted) {
            return;
          }

          setPosition({ left: x + Math.round(width / 2), top: y + Math.round(height / 2) });
        }
      );
    }
    return () => {
      mounted = false;
    };
    /* eslint-disable react-hooks/exhaustive-deps */
    // Tests break if you pass the ref/relativeTo higher object in and not the actual value we're using
  }, [relativeTo.current]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return <Tooltip left={position.left} top={position.top} text={text} />;
};

export default RelativeTooltip;
