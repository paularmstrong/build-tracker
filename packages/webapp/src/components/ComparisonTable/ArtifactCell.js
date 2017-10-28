// @flow
import ArtifactSwitch from '../ArtifactSwitch';
import styles from './styles';
import { Th } from '../Table';
import React, { PureComponent } from 'react';

const emptyObject = {};

export default class ArtifactCell extends PureComponent {
  props: {
    active: boolean,
    artifactName: string,
    color: string,
    disabled?: boolean,
    hoverColor?: string,
    isHovered?: boolean,
    link?: string,
    onToggle: Function
  };

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
