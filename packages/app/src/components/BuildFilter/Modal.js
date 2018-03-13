// @flow
import * as React from 'react';
import DateRangePicker from '../DateRangePicker';
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
const emptyArray = [];

export default class BuildFilter extends React.Component<Props, State> {
  _el: HTMLElement;
  _artifactNameFiltersAvailable: boolean;

  constructor(props: Props, context: any) {
    super(props, context);
    this._el = document.createElement('div');
    this._artifactNameFiltersAvailable = !!props.defaultArtifactFilters.length;
    this.state = {
      artifactFilters: props.artifactFilters,
      artifactsFiltered: !!props.artifactFilters.length,
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
    const { artifactFilters, artifactsFiltered, endDate, startDate } = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text>Edit Filters</Text>
            <Button onPress={this._handleClose} title="Done" />
          </View>
          <View style={styles.content}>
            <DateRangePicker endDate={endDate} onChangeRange={this._handleChangeDateRange} startDate={startDate} />
            <View style={styles.hr} />
            <View style={styles.filters}>
              <Switch
                disabled={!this._artifactNameFiltersAvailable}
                onValueChange={this._handleToggleFilters}
                value={artifactsFiltered}
              />
              <Text style={styles.filterText}>Artifact name filters</Text>
            </View>
            {artifactFilters.length ? (
              <View accessibilityRole="list" style={styles.filterList}>
                {artifactFilters.map(filter => (
                  <View accessibilityRole="listitem" style={styles.filterItem}>
                    <Text style={styles.filter}>{filter.toString()}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  _handleChangeDateRange = (startDate: Date, endDate: Date) => {
    this.setState({ startDate, endDate });
  };

  _handleToggleFilters = (artifactsFiltered: boolean) => {
    const { artifactFilters, defaultArtifactFilters } = this.props;
    this.setState({
      artifactFilters: artifactsFiltered
        ? artifactFilters.length ? artifactFilters : defaultArtifactFilters
        : emptyArray,
      artifactsFiltered
    });
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
  filters: {
    flexDirection: 'row',
    paddingHorizontal: theme.spaceMedium
  },
  filterText: {
    paddingLeft: theme.spaceXXSmall
  },
  filterList: {
    paddingHorizontal: theme.spaceMedium
  },
  filter: {
    fontFamily: 'monospace'
  }
});
