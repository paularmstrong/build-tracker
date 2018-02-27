// @flow
import * as React from 'react';
import BranchPicker from '../BranchPicker';
import DateRangePicker from '../DateRangePicker';
import type { Filters } from './types';
import ReactDOM from 'react-dom';
import theme from '../../theme';
import { Button, StyleSheet, Text, View } from 'react-native';

type Props = Filters & {
  branches: Array<string>,
  onClose: (filters: Filters) => void
};

type State = Filters;

const modalRoot = document.getElementById('buildFilterRoot');

export default class BuildFilter extends React.Component<Props, State> {
  _el: HTMLElement;

  constructor(props: Props, context: any) {
    super(props, context);
    this._el = document.createElement('div');
    this.state = {
      baseBranch: props.baseBranch,
      compareBranch: props.compareBranch,
      endDate: props.endDate,
      startDate: props.startDate
    };
  }

  componentDidMount() {
    modalRoot && modalRoot.appendChild(this._el);
  }

  componentWillUnmount() {
    modalRoot && modalRoot.removeChild(this._el);
  }

  render() {
    return ReactDOM.createPortal(this._render(), this._el);
  }

  _render() {
    const { branches } = this.props;
    const { baseBranch, compareBranch, endDate, startDate } = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text>Edit Filters</Text>
            <Button onPress={this._handleClose} title="Done" />
          </View>
          <View style={styles.content}>
            <BranchPicker
              baseBranch={baseBranch}
              branches={branches}
              compareBranch={compareBranch}
              onChangeBranches={this._handleChangeBranches}
            />
            <View style={styles.hr} />
            <DateRangePicker endDate={endDate} onChangeRange={this._handleChangeDateRange} startDate={startDate} />
          </View>
        </View>
      </View>
    );
  }

  _handleChangeDateRange = (startDate: Date, endDate: Date) => {
    this.setState({ startDate, endDate });
  };

  _handleChangeBranches = (baseBranch: string, compareBranch: string) => {
    this.setState({ baseBranch, compareBranch });
  };

  _handleClose = () => {
    this.props.onClose(this.state);
  };
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'rgba(0,0,0,0.24)',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0
  },
  container: {
    backgroundColor: theme.colorWhite,
    margin: 'auto',
    boxShadow: '0 0 8px 0 rgba(0,0,0,0.12), 0 8px 8px 0 rgba(0,0,0,0.24)'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: theme.spaceSmall,
    paddingVertical: theme.spaceXSmall,
    borderBottomColor: theme.colorGray
  },
  content: {
    paddingVertical: theme.spaceXLarge,
    paddingHorizontal: theme.spaceXXLarge
  },
  hr: {
    marginVertical: theme.spaceSmall,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorGray
  }
});
