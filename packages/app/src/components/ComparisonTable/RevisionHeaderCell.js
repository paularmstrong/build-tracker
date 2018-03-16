// @flow
import { formatSha } from '../../modules/formatting';
import Hoverable from '../Hoverable';
import IconX from '../icons/IconX';
import styles from './styles';
import { Th } from '../Table';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

type Props = {
  onClickInfo?: (revision: string) => void,
  onClickRemove?: (revision: string) => void,
  revision: string
};

export default class RevisionHeaderCell extends PureComponent<Props> {
  render() {
    const { revision } = this.props;
    return (
      <Hoverable>
        {isHovered => (
          <Th style={[styles.cell, styles.header]} title={revision}>
            <View style={styles.headerContent}>
              <Text onClick={this._handleClickInfo} style={[styles.headerSha, isHovered && styles.headerShaHovered]}>
                {formatSha(revision)}
              </Text>
              <View onClick={this._handleClickRemove}>
                <Text style={[styles.headerButton, styles.removeBuild]}>
                  <IconX />
                </Text>
              </View>
            </View>
          </Th>
        )}
      </Hoverable>
    );
  }

  _handleClickRemove = () => {
    const { onClickRemove, revision } = this.props;
    onClickRemove && onClickRemove(revision);
  };

  _handleClickInfo = () => {
    const { onClickInfo, revision } = this.props;
    onClickInfo && onClickInfo(revision);
  };
}
