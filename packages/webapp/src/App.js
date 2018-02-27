// @flow
import BranchPicker from './components/BranchPicker';
import BuildInfo from './components/BuildInfo';
import Chart from './components/Chart';
import ComparisonTable from './components/ComparisonTable';
import deepEqual from 'deep-equal';
import { formatSha } from './modules/formatting';
import { object } from 'prop-types';
import theme from './theme';
import Toggles from './components/Toggles';
import { ChartType, ValueType, valueTypeAccessor, XScaleType, YScaleType } from './modules/values';
import { getBranches, getBuilds } from './api';
import { interpolateRainbow, scaleSequential } from 'd3-scale';
import type { Location, Match, RouterHistory } from 'react-router-dom';
import React, { Component } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

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
    .filter(Boolean);
  return activeArtifactNames.length
    ? allArtifactNames.filter((b: string) => activeArtifactNames.indexOf(b) !== -1)
    : allArtifactNames;
};

const _getCompareBuilds = (props: { match: Match }, builds: Array<Build>): Array<Build> => {
  const { match: { params } } = props;
  const { compareRevisions = '' } = params;

  const buildRevisions = compareRevisions ? compareRevisions.split('+') : emptyArray;

  if (!buildRevisions.length) {
    return emptyArray;
  }

  return builds.filter(b => buildRevisions.indexOf(formatSha(b.meta.revision)) !== -1);
};

const _getColorScale = (length: number): Function => scaleSequential(interpolateRainbow).domain([0, length]);

const _filterArtifactNames = (artifactNames: Array<string>, filters: ArtifactFilters): Array<string> => {
  if (!filters || filters.length === 0) {
    return artifactNames;
  }

  return artifactNames.filter(name => filters.some(filter => !filter.test(name)));
};

type Props = {
  history: RouterHistory,
  location: Location,
  match: Match
};

type State = {
  activeArtifactNames: Array<string>,
  artifactFilters: ArtifactFilters,
  artifactNames: Array<string>,
  branches: Array<string>,
  builds: Array<Build>,
  chart: $Values<typeof ChartType>,
  colorScale?: Function,
  compareBuilds: Array<Build>,
  filteredArtifactNames: Array<string>,
  hoveredArtifact?: string,
  selectedBuild?: Build,
  isFiltered: boolean,
  valueType: $Values<typeof ValueType>,
  xscale: $Values<typeof XScaleType>,
  yscale: $Values<typeof YScaleType>
};

class App extends Component<Props, State> {
  static contextTypes = {
    config: object
  };

  constructor(props: Props, context: { config: AppConfig }) {
    super(props, context);
    this.state = {
      activeArtifactNames: [],
      artifactFilters: context.config.artifactFilters || [],
      artifactNames: [],
      branches: [],
      builds: [],
      chart: ChartType.AREA,
      compareBuilds: [],
      filteredArtifactNames: [],
      isFiltered: true,
      valueType: ValueType.GZIP,
      xscale: XScaleType.COMMIT,
      yscale: YScaleType.LINEAR
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!deepEqual(this.props.match.params, nextProps.match.params)) {
      this.setState(state => ({
        activeArtifactNames: _getActiveArtifactNames(nextProps, state.artifactNames),
        compareBuilds: _getCompareBuilds(nextProps, state.builds)
      }));
    }
  }

  render() {
    const {
      activeArtifactNames,
      artifactFilters,
      artifactNames,
      builds,
      filteredArtifactNames,
      chart,
      colorScale,
      compareBuilds,
      hoveredArtifact,
      selectedBuild,
      isFiltered,
      valueType,
      xscale,
      yscale
    } = this.state;

    return (
      <View style={styles.root}>
        <View style={styles.main}>
          <View style={styles.scaleTypeButtons}>
            <Toggles
              chartType={chart}
              onToggle={this._handleToggleValueTypes}
              valueType={valueType}
              xScaleType={xscale}
              yScaleType={yscale}
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
                    selectedBuilds={compareBuilds.map(b => b.meta.revision)}
                    valueAccessor={valueTypeAccessor[valueType]}
                    xScaleType={xscale}
                    yScaleType={yscale}
                  />
                ) : null}
                {artifactFilters.length ? (
                  <View style={styles.filters}>
                    <Switch onValueChange={this._handleToggleFilters} value={isFiltered} />
                    <Text style={styles.filterText}>
                      Filters{' '}
                      {isFiltered
                        ? `enabled (${artifactNames.length - filteredArtifactNames.length} hidden)`
                        : 'disabled'}
                    </Text>
                  </View>
                ) : null}
                <BranchPicker branches={this.state.branches} />
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
          <View style={styles.info}>{selectedBuild ? <BuildInfo build={selectedBuild} /> : null}</View>
        </View>
      </View>
    );
  }

  _fetchData() {
    const { match: { params: { revisions } } } = this.props;
    const opts = {};
    if (revisions) {
      opts.revisions = revisions.split(',');
    }

    getBuilds(opts).then(({ builds, artifactNames }: { builds: Array<Build>, artifactNames: Array<string> }) => {
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

    getBranches().then((branches: Array<string>) => {
      this.setState(() => ({ branches }));
    });
  }

  _handleToggleFilters = (isFiltered: boolean) => {
    this.setState(({ artifactFilters, artifactNames }) => {
      const filteredArtifactNames = isFiltered ? _filterArtifactNames(artifactNames, artifactFilters) : artifactNames;
      return {
        colorScale: _getColorScale(filteredArtifactNames.length),
        filteredArtifactNames,
        isFiltered
      };
    });
  };

  _handleToggleValueTypes = (toggleType: string, value: string) => {
    this.setState({ [toggleType]: value });
  };

  _handleHover = (hoveredArtifact?: string, build?: Build) => {
    this.setState({ hoveredArtifact });
  };

  _handleArtifactsChange = (activeArtifacts: Array<string>) => {
    this.setState(
      ({ artifactFilters }) => ({ activeArtifactNames: _filterArtifactNames(activeArtifacts, artifactFilters) }),
      this._updateUrl
    );
  };

  _handleSelectBuild = (build: Build) => {
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
        compareBuilds: state.compareBuilds.filter(build => build.meta.revision !== revision),
        selectedBuild: state.compareBuilds.length ? state.compareBuilds[0] : undefined
      }),
      this._updateUrl
    );
  };

  _handleShowBuildInfo = (revision: string) => {
    this.setState(state => ({
      selectedBuild: state.compareBuilds.find(build => build.meta.revision === revision)
    }));
  };

  _updateUrl = () => {
    const { location: { pathname }, match: { params: { revisions } } } = this.props;
    const { activeArtifactNames, artifactNames, compareBuilds } = this.state;
    const urlArtifacts =
      activeArtifactNames.length > 1 && activeArtifactNames.length !== artifactNames.length
        ? activeArtifactNames.filter(b => b !== 'All')
        : ['All'];
    const urlRevisions = compareBuilds.map((b: Build) => formatSha(b.meta.revision)).sort();
    const newPath = `${revisions ? `/revisions/${revisions}` : ''}/${urlArtifacts.join('+')}/${urlRevisions.join('+')}`;
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
  data: {
    flexGrow: 0,
    minWidth: `${2 * (100 / theme.columns)}%`,
    maxWidth: `${6 * (100 / theme.columns)}%`,
    borderLeftStyle: 'solid',
    borderLeftWidth: '1px',
    borderLeftColor: theme.colorGray
  },
  table: {
    overflowY: 'scroll',
    minHeight: '50vh',
    maxHeight: '80vh',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: theme.colorGray
  },
  info: {
    flexGrow: 1,
    minHeight: '20vh',
    maxHeight: '50vh',
    margin: theme.spaceSmall
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
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: theme.spaceMedium
  },
  filterText: {
    paddingLeft: theme.spaceXXSmall
  }
});

export default App;
