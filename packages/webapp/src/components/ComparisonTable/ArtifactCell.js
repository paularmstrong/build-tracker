// @flow
import ArtifactSwitch from '../ArtifactSwitch';
import styles from './styles';
import { Th } from '../Table';
import React, { PureComponent } from 'react';

import type { Props as ArtifactSwitchProps } from '../ArtifactSwitch';

const emptyObject = {};

type ArtifactCellProps = ArtifactSwitchProps & {
  hoverColor?: string,
  isHovered?: boolean
};

export default class ArtifactCell extends PureComponent<ArtifactCellProps> {
  render() {
    const { hoverColor, isHovered, ...otherProps } = this.props;
    return (
      <Th
        style={[
          styles.cell,
          styles.rowHeader,
          styles.stickyColumn,
          isHovered ? { backgroundColor: hoverColor } : emptyObject
        ]}
      >
        <ArtifactSwitch {...otherProps} />
      </Th>
    );
  }
}
