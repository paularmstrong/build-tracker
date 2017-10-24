// @flow
import BundleSwitch from '../BundleSwitch';
import styles from './styles';
import { Th } from '../Table';
import React, { PureComponent } from 'react';

const emptyObject = {};

export default class BundleCell extends PureComponent {
  props: {
    active: boolean,
    bundleName: string,
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
        <BundleSwitch {...otherProps} />
      </Th>
    );
  }
}
