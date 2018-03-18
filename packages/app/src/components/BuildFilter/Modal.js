// @flow
import * as React from 'react';
import type { BT$ArtifactFilters } from '@build-tracker/types';
import DateRangePicker from '../DatePicker/Range';
import type { Filters } from './types';
import ReactDOM from 'react-dom';
import theme from '../../theme';
import { Button, StyleSheet, Switch, Text, View } from 'react-native';

type Props = {
  artifactFilters: BT$ArtifactFilters,
  defaultArtifactFilters: BT$ArtifactFilters,
  onClose: (filters: Filters) => void,
  startDate: Date,
  endDate: Date
};

type State = Filters;

const modalRoot = document.getElementById('buildFilterRoot');

export default class BuildFilter extends React.Component<Props, State> {
  _el: HTMLElement;

  constructor(props: Props, context: any) {
    super(props, context);
    this._el = document.createElement('div');
    this.state = {
      artifactFilters: props.artifactFilters,
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
    const { defaultArtifactFilters } = this.props;
    const { artifactFilters, endDate, startDate } = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text>Edit Filters</Text>
            <Button onPress={this._handleClose} title="Done" />
          </View>
          <View style={styles.content}>
            {!window.DATA ? (
              <React.Fragment>
                <DateRangePicker endDate={endDate} onChangeRange={this._handleChangeDateRange} startDate={startDate} />
                <View style={styles.hr} />
              </React.Fragment>
            ) : null}
            {defaultArtifactFilters.length ? (
              <React.Fragment>
                <Text style={styles.filterHeader}>Artifact name filters</Text>
                <View accessibilityRole="list" style={styles.filterList}>
                  {defaultArtifactFilters.map((filter, i) => (
                    <View accessibilityRole="listitem" key={i} style={styles.filterItem}>
                      {/* eslint-disable react/jsx-no-bind */}
                      <Switch
                        onValueChange={(value: boolean) => this._handleToggleFilter(filter, value)}
                        value={artifactFilters.indexOf(filter) !== -1}
                      />
                      {/* eslint-enable react/jsx-no-bind */}
                      <Text style={styles.filterText}>{filter.toString()}</Text>
                    </View>
                  ))}
                </View>
              </React.Fragment>
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  _handleChangeDateRange = (startDate: Date, endDate: Date) => {
    this.setState({ startDate, endDate });
  };

  _handleToggleFilter = (filter: RegExp, value: boolean) => {
    this.setState(({ artifactFilters }) => ({
      artifactFilters: !value ? artifactFilters.filter(aFilter => aFilter !== filter) : [...artifactFilters, filter]
    }));
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
  },
  filterItem: {
    flexDirection: 'row',
    marginBottom: theme.spaceXXSmall
  },
  filterHeader: {
    fontWeight: 'bold'
  },
  filterText: {
    fontFamily: 'monospace',
    paddingLeft: theme.spaceXXSmall
  },
  filterList: {
    paddingHorizontal: theme.spaceMedium
  }
});
