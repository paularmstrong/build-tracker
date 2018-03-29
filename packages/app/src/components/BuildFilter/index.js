// @flow
import * as React from 'react';
import type { BT$ArtifactFilters } from '@build-tracker/types';
import type { Filters } from './types';
import { formatDate } from '../../modules/formatting';
import isSameDay from 'date-fns/is_same_day';
import isToday from 'date-fns/is_today';
import Modal from './Modal';
import theme from '../../theme';
import { Button, StyleSheet, Text, View } from 'react-native';

type Props = {
  artifactFilters: BT$ArtifactFilters,
  defaultArtifactFilters: BT$ArtifactFilters,
  startDate?: Date,
  endDate?: Date,
  onFilter: (filters: Filters) => void
};

type State = {
  modalVisible: boolean
};

export default class BuildFilter extends React.Component<Props, State> {
  state = { modalVisible: false };

  render() {
    const { artifactFilters, endDate, startDate, defaultArtifactFilters } = this.props;
    const { modalVisible } = this.state;
    return (
      <View style={styles.root}>
        {!window.DATA &&
        startDate &&
        endDate &&
        (!isSameDay(startDate, endDate) || (!isToday(startDate) && !isToday(endDate))) ? (
          <View style={styles.filter}>
            <Text style={styles.filterLabel}>Date Range:</Text>
            <Text>{`${formatDate(startDate)} – ${formatDate(endDate)}`}</Text>
          </View>
        ) : null}
        <Button onPress={this._handleOpenModal} title="Edit Filters" />
        {modalVisible ? (
          <Modal
            artifactFilters={artifactFilters}
            defaultArtifactFilters={defaultArtifactFilters}
            endDate={endDate}
            onClose={this._handleCloseModal}
            startDate={startDate}
          />
        ) : null}
      </View>
    );
  }

  _handleOpenModal = () => {
    this.setState({ modalVisible: true });
  };

  _handleCloseModal = (filters: Filters) => {
    this.setState({ modalVisible: false }, () => {
      this.props.onFilter(filters);
    });
  };
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  filter: {
    flexDirection: 'row',
    marginEnd: theme.spaceMedium
  },
  filterLabel: {
    fontWeight: 'bold',
    marginEnd: theme.spaceXSmall
  }
});
