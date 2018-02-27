// @flow
import * as React from 'react';
import endOfDay from 'date-fns/end_of_day';
import type { Filters } from './types';
import isSameDay from 'date-fns/is_same_day';
import isToday from 'date-fns/is_today';
import Modal from './Modal';
import startOfDay from 'date-fns/start_of_day';
import theme from '../../theme';
import { Button, StyleSheet, Text, View } from 'react-native';

type Props = {
  branches: Array<string>,
  startDate?: Date,
  endDate?: Date,
  onFilter: (filters: Filters) => void
};

type State = Filters & {
  modalVisible: boolean
};

const today = new Date();

export default class BuildFilter extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {
      baseBranch: props.branches[0],
      compareBranch: props.branches[0],
      endDate: endOfDay(today),
      modalVisible: false,
      startDate: startOfDay(today)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const { baseBranch, compareBranch } = this.state;
    const { branches } = nextProps;
    if (branches !== this.props.branches) {
      this.setState({ baseBranch: branches[0], compareBranch: branches[0] });
    } else if (
      (baseBranch && compareBranch && branches.indexOf(baseBranch) === -1) ||
      branches.indexOf(compareBranch) === -1
    ) {
      this.setState({ baseBranch: undefined, compareBranch: undefined });
    }
  }

  render() {
    const { branches } = this.props;
    const { baseBranch, compareBranch, endDate, startDate, modalVisible } = this.state;
    return (
      <View style={styles.root}>
        {!isSameDay(startDate, endDate) || (!isToday(startDate) && !isToday(endDate)) ? (
          <View style={styles.filter}>
            <Text style={styles.filterLabel}>Date Range:</Text>
            <Text>{`${startDate.toLocaleDateString()} – ${endDate.toLocaleDateString()}`}</Text>
          </View>
        ) : null}
        {baseBranch && compareBranch && (baseBranch !== 'master' || compareBranch !== 'master') ? (
          <View style={styles.filter}>
            <Text style={styles.filterLabel}>Branches:</Text>
            <Text>{`${baseBranch}..${compareBranch}`}</Text>
          </View>
        ) : null}
        <Button onPress={this._handleOpenModal} title="Edit Filters" />
        {modalVisible ? (
          <Modal
            baseBranch={baseBranch}
            branches={branches}
            compareBranch={compareBranch}
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
    this.setState({ ...filters, modalVisible: false }, () => {
      const { baseBranch, compareBranch, endDate, startDate } = this.state; // eslint-disable-line
      this.props.onFilter({ baseBranch, compareBranch, endDate, startDate });
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
