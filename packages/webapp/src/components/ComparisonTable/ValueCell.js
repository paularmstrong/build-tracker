// @flow
import { bytesToKb } from '../../modules/formatting';
import styles from './styles';
import { Td } from '../Table';
import React, { PureComponent } from 'react';

const emptyObject = {};

export default class ValueCell extends PureComponent {
  props: {
    bytes: number,
    color?: string,
    colSpan?: number,
    hoverColor?: string,
    isHovered: boolean
  };

  static defaultProps = {
    colSpan: 1
  };

  render() {
    const { bytes, color, colSpan, hoverColor, isHovered } = this.props;
    return (
      <Td
        colSpan={colSpan}
        style={[
          styles.cell,
          isHovered ? { backgroundColor: hoverColor } : emptyObject,
          color ? { backgroundColor: color } : emptyObject
        ]}
      >
        {bytes ? bytesToKb(bytes) : '-'}
      </Td>
    );
  }
}
