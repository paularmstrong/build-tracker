// @flow
import BuildFilter from './components/BuildFilter';
import BuildInfo from './components/BuildInfo';
import { BuildMeta } from '@build-tracker/builds';
import Chart from './components/Chart';
import ComparisonTable from './components/ComparisonTable';
import deepEqual from 'deep-equal';
import endOfDay from 'date-fns/end_of_day';
import type { Filters } from './components/BuildFilter/types';
import { formatSha } from './modules/formatting';
import { getBuilds } from './api';
import { object } from 'prop-types';
import startOfDay from 'date-fns/start_of_day';
import subDays from 'date-fns/sub_days';
import theme from './theme';
import Toggles from './components/Toggles';
import { ChartType, ValueType, valueTypeAccessor, XScaleType, YScaleType } from './modules/values';
import { interpolateRainbow, scaleSequential } from 'd3-scale';
import type { Location, Match, RouterHistory } from 'react-router-dom';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const emptyArray = [];

const _getActiveArtifactNames = (props: { match: Match }, allArtifactNames: Array<string>): Array<string> => {
  const { match: { params } } = props;
  const { artifactNames } = params;
  if (!artifactNames) {
    return allArtifactNames;
  }
  const activeArtifactNames = artifactNames
    .replace(/All\+?/, '')
    .split('+')
    .map(name => window.decodeURIComponent(name))
    .filter(Boolean);
  return activeArtifactNames.length
    ? allArtifactNames.filter((b: string) => activeArtifactNames.indexOf(b) !== -1)
    : allArtifactNames;
};

const _getCompareBuilds = (props: { match: Match }, builds: Array<BT$Build>): Array<BT$Build> => {
  const { match: { params } } = props;
  const { compareRevisions = '' } = params;

  const buildRevisions = compareRevisions ? compareRevisions.split('+') : emptyArray;

  if (!buildRevisions.length) {
    return emptyArray;
  }

  return builds.filter(b => buildRevisions.indexOf(formatSha(BuildMeta.getRevision(b))) !== -1);
};

const _getColorScale = (length: number): Function => scaleSequential(interpolateRainbow).domain([0, length]);

const _filterArtifactNames = (artifactNames: Array<string>, filters: BT$ArtifactFilters): Array<string> => {
  return artifactNames.filter(name => !filters.some(filter => !!filter.test(name)));
};

type Props = {
  history: RouterHistory,
  location: Location,
  match: Match
};

type State = {
  activeArtifactNames: Array<string>,
  artifactFilters: BT$ArtifactFilters,
  artifactNames: Array<string>,
  builds: Array<BT$Build>,
  chart: $Values<typeof ChartType>,
  colorScale?: Function,
  compareBuilds: Array<BT$Build>,
  endDate: Date,
  filteredArtifactNames: Array<string>,
  hoveredArtifact?: string,
  isFiltered: boolean,
  selectedBuild?: BT$Build,
  startDate: Date,
  valueType: $Values<typeof ValueType>,
  xscale: $Values<typeof XScaleType>,
  yscale: $Values<typeof YScaleType>
};

const today = new Date();

class App extends Component<Props, State> {
  _defaultFilters: BT$ArtifactFilters;

  static contextTypes = {
    config: object
  };

  constructor(props: Props, context: { config: BT$AppConfig }) {
    super(props, context);
    this._defaultFilters = context.config.artifactFilters || [];
    this.state = {
      activeArtifactNames: [],
      artifactFilters: this._defaultFilters,
      artifactNames: [],
      builds: [],
      chart: ChartType.AREA,
      compareBuilds: [],
      endDate: endOfDay(today),
      filteredArtifactNames: [],
      isFiltered: true,
      startDate: subDays(startOfDay(today), 30),
      valueType: ValueType.GZIP,
      xscale: XScaleType.COMMIT,
      yscale: YScaleType.LINEAR
    };
  }

  componentDidMount() {
    this._fetchData({ startDate: this.state.startDate.valueOf(), endDate: this.state.endDate.valueOf() });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!deepEqual(this.props.match.params, nextProps.match.params)) {
      this.setState(state => ({
        activeArtifactNames: _filterArtifactNames(
          _getActiveArtifactNames(nextProps, state.artifactNames),
          this.state.artifactFilters
        ),
        compareBuilds: _getCompareBuilds(nextProps, state.builds)
      }));
    }
  }

  render() {
    const {
      activeArtifactNames,
      artifactFilters,
      builds,
      endDate,
      filteredArtifactNames,
      chart,
      colorScale,
      compareBuilds,
      hoveredArtifact,
      selectedBuild,
      startDate,
      valueType,
      xscale,
      yscale
    } = this.state;

    return (
      <View style={styles.root}>
        <View style={styles.main}>
          <View style={styles.header}>
            <Text style={styles.title}>Build Tracker</Text>
            <BuildFilter
              artifactFilters={artifactFilters}
              defaultArtifactFilters={this._defaultFilters}
              endDate={endDate}
              onFilter={this._handleChangeBuildFilter}
              startDate={startDate}
            />
          </View>
          <View style={styles.innerMain}>
            <View style={styles.chartRoot}>
              <View style={styles.chart}>
                {builds && colorScale ? (
                  <Chart
                    activeArtifactNames={activeArtifactNames}
                    artifacts={filteredArtifactNames}
                    builds={builds}
                    chartType={chart}
                    colorScale={colorScale}
                    onHover={this._handleHover}
                    onSelectBuild={this._handleSelectBuild}
                    selectedBuilds={compareBuilds.map((b: BT$Build) => BuildMeta.getRevision(b))}
                    valueAccessor={valueTypeAccessor[valueType]}
                    xScaleType={xscale}
                    yScaleType={yscale}
                  />
                ) : null}
                <View style={styles.scaleTypeButtons}>
                  <Toggles
                    chartType={chart}
                    onToggle={this._handleToggleValueTypes}
                    valueType={valueType}
                    xScaleType={xscale}
                    yScaleType={yscale}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.data}>
          <View style={styles.table}>
            <ComparisonTable
              activeArtifactNames={activeArtifactNames}
              artifactNames={filteredArtifactNames}
              builds={compareBuilds}
              colorScale={colorScale}
              hoveredArtifact={hoveredArtifact}
              onArtifactsChange={this._handleArtifactsChange}
              onRemoveBuild={this._handleRemoveRevision}
              onShowBuildInfo={this._handleShowBuildInfo}
              valueType={valueType}
            />
          </View>
          <View style={styles.info}>
            {selectedBuild ? <BuildInfo build={selectedBuild} /> : <Text>Select a build to see more information.</Text>}
          </View>
        </View>
      </View>
    );
  }

  _fetchData(options: {} = {}) {
    const { match: { params: { revisions } } } = this.props;
    const opts = { ...options };
    if (revisions) {
      opts.revisions = revisions.split(',');
    }

    getBuilds(opts).then(({ builds, artifactNames }: { builds: Array<BT$Build>, artifactNames: Array<string> }) => {
      const { artifactFilters } = this.state;
      const filteredArtifactNames = _filterArtifactNames(artifactNames, artifactFilters);
      const colorScale = _getColorScale(filteredArtifactNames.length);
      this.setState(() => ({
        activeArtifactNames: _getActiveArtifactNames(this.props, filteredArtifactNames),
        artifactNames,
        builds,
        chart: builds.length <= 4 ? ChartType.BAR : ChartType.AREA,
        colorScale,
        compareBuilds: _getCompareBuilds(this.props, builds),
        filteredArtifactNames
      }));
    });
  }

  _handleChangeBuildFilter = (filters: Filters) => {
    const { startDate: prevStartDate, endDate: prevEndDate } = this.state;
    this.setState(
      ({ artifactNames }) => {
        const filteredArtifactNames = _filterArtifactNames(artifactNames, filters.artifactFilters);
        return {
          activeArtifactNames: _getActiveArtifactNames(this.props, filteredArtifactNames),
          artifactFilters: filters.artifactFilters,
          colorScale: _getColorScale(filteredArtifactNames.length),
          endDate: filters.endDate,
          filteredArtifactNames,
          startDate: filters.startDate
        };
      },
      () => {
        const { startDate, endDate } = this.state;
        if (prevStartDate !== startDate || prevEndDate !== endDate) {
          this._fetchData({
            startTime: startDate.valueOf(),
            endTime: endDate.valueOf()
          });
        }
      }
    );
  };

  _handleToggleValueTypes = (toggleType: string, value: string) => {
    this.setState({ [toggleType]: value });
  };

  _handleHover = (hoveredArtifact?: string, build?: BT$Build) => {
    this.setState({ hoveredArtifact });
  };

  _handleArtifactsChange = (activeArtifacts: Array<string>) => {
    this.setState(
      ({ artifactFilters, artifactNames }) => ({
        activeArtifactNames: _filterArtifactNames(
          activeArtifacts.length === 1 && activeArtifacts[0] === 'All' ? artifactNames : activeArtifacts,
          artifactFilters
        )
      }),
      this._updateUrl
    );
  };

  _handleSelectBuild = (build: BT$Build) => {
    this.setState(
      state => ({
        compareBuilds: [...state.compareBuilds, build].filter((value, index, self) => self.indexOf(value) === index),
        selectedBuild: build
      }),
      this._updateUrl
    );
  };

  _handleRemoveRevision = (revision: string) => {
    this.setState(
      state => ({
        compareBuilds: state.compareBuilds.filter(build => BuildMeta.getRevision(build) !== revision),
        selectedBuild: state.compareBuilds.length ? state.compareBuilds[0] : undefined
      }),
      this._updateUrl
    );
  };

  _handleShowBuildInfo = (revision: string) => {
    this.setState(state => ({
      selectedBuild: state.compareBuilds.find(build => BuildMeta.getRevision(build) === revision)
    }));
  };

  _updateUrl = () => {
    const { location: { pathname }, match: { params: { revisions } } } = this.props;
    const { activeArtifactNames, compareBuilds, filteredArtifactNames } = this.state;
    const urlArtifacts =
      activeArtifactNames.length > 1 && activeArtifactNames.length !== filteredArtifactNames.length
        ? activeArtifactNames.filter(b => b !== 'All')
        : activeArtifactNames.length === 0 ? ['None'] : activeArtifactNames;
    const safeUrlArtifacts = urlArtifacts.map(name => window.encodeURIComponent(name));
    const urlRevisions = compareBuilds.map((b: BT$Build) => formatSha(BuildMeta.getRevision(b))).sort();
    const newPath = `${revisions ? `/revisions/${revisions}` : ''}/${safeUrlArtifacts.join('+')}/${urlRevisions.join(
      '+'
    )}`;
    if (newPath !== pathname) {
      this.props.history.push(newPath);
    }
  };
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: '100vh',
    position: 'absolute',
    width: '100vw',
    top: 0,
    left: 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spaceMedium,
    paddingVertical: theme.spaceXSmall,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorGray
  },
  title: {
    fontWeight: 'bold'
  },
  data: {
    flexGrow: 0,
    minWidth: '20vw',
    maxWidth: '50vw',
    maxHeight: '100vh',
    borderLeftStyle: 'solid',
    borderLeftWidth: '1px',
    borderLeftColor: theme.colorGray
  },
  table: {
    overflowY: 'scroll',
    minHeight: '75%',
    maxHeight: '75%',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: theme.colorGray
  },
  info: {
    minHeight: '25%',
    maxHeight: '25%',
    padding: theme.spaceSmall,
    overflowY: 'scroll'
  },
  main: {
    height: '100vh',
    maxHeight: '100vh',
    overflowY: 'auto',
    flexGrow: 1
  },
  innerMain: {
    flexGrow: 1
  },
  chartRoot: {
    position: 'absolute',
    top: 0,
    left: 0,
    minHeight: '100%',
    width: '100%'
  },
  chart: {
    flexGrow: 1
  },
  scaleTypeButtons: {
    flex: 0,
    marginTop: theme.spaceSmall,
    marginRight: theme.spaceSmall,
    marginBottom: theme.spaceSmall
  }
});

export default App;
