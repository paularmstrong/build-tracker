// @flow
import BranchPicker from './components/BranchPicker';
import BuildInfo from './components/BuildInfo';
import ComparisonTable from './components/ComparisonTable';
import deepEqual from 'deep-equal';
import Chart from './components/Chart';
import { formatSha } from './modules/formatting';
import { getBranches, getBuilds } from './api';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from './theme';
import Toggles from './components/Toggles';
import { interpolateRainbow, scaleSequential } from 'd3-scale';
import { ChartType, ValueType, valueTypeAccessor, XScaleType, YScaleType } from './modules/values';

import type { Location, Match, RouterHistory } from 'react-router-dom';
import type { Build, Artifact } from 'build-tracker-flowtypes';

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

type AppProps = {
  history: RouterHistory,
  location: Location,
  match: Match
};

type AppState = {
  activeArtifactNames: Array<string>,
  artifactNames: Array<string>,
  branches: Array<string>,
  builds: Array<Build>,
  chart: $Values<typeof ChartType>,
  compareBuilds: Array<Build>,
  hoveredArtifact?: string,
  selectedBuild?: Build,
  values: $Values<typeof ValueType>,
  xscale: $Values<typeof XScaleType>,
  yscale: $Values<typeof YScaleType>
};

class App extends Component<AppProps, AppState> {
  _colorScale: Function;

  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {
      activeArtifactNames: [],
      branches: [],
      builds: [],
      artifactNames: [],
      chart: ChartType.AREA,
      compareBuilds: [],
      values: ValueType.GZIP,
      xscale: XScaleType.COMMIT,
      yscale: YScaleType.LINEAR
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  componentWillReceiveProps(nextProps: Object) {
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
      builds,
      artifactNames,
      chart,
      compareBuilds,
      hoveredArtifact,
      selectedBuild,
      values,
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
              valueType={values}
              xScaleType={xscale}
              yScaleType={yscale}
            />
          </View>
          <View style={styles.innerMain}>
            <View style={styles.chartRoot}>
              <View style={styles.chart}>
                <Chart
                  activeArtifactNames={activeArtifactNames}
                  artifacts={artifactNames}
                  builds={builds}
                  chartType={chart}
                  colorScale={this._colorScale}
                  onHover={this._handleHover}
                  onSelectBuild={this._handleSelectBuild}
                  selectedBuilds={compareBuilds.map(b => b.meta.revision)}
                  valueAccessor={valueTypeAccessor[values]}
                  xScaleType={xscale}
                  yScaleType={yscale}
                />
                <BranchPicker branches={this.state.branches} />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.data}>
          <View style={styles.table}>
            <ComparisonTable
              activeArtifactNames={activeArtifactNames}
              builds={compareBuilds}
              artifactNames={artifactNames}
              colorScale={this._colorScale}
              hoveredArtifact={hoveredArtifact}
              onArtifactsChange={this._handleArtifactsChange}
              onRemoveBuild={this._handleRemoveRevision}
              onShowBuildInfo={this._handleShowBuildInfo}
              valueAccessor={valueTypeAccessor[values]}
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

    getBuilds(opts).then(({ builds, artifacts }: { builds: Array<Build>, artifacts: Array<string> }) => {
      this._colorScale = scaleSequential(interpolateRainbow).domain([0, artifacts.length]);
      this.setState(() => ({
        activeArtifactNames: _getActiveArtifactNames(this.props, artifacts),
        builds,
        artifactNames: artifacts,
        chart: builds.length <= 4 ? ChartType.BAR : ChartType.AREA,
        compareBuilds: _getCompareBuilds(this.props, builds)
      }));
    });

    getBranches().then((branches: Array<string>) => {
      this.setState(() => ({ branches }));
    });
  }

  _handleToggleValueTypes = (toggleType: string, value: string) => {
    this.setState({ [toggleType]: value });
  };

  _handleHover = (hoveredArtifact?: string, build?: Build) => {
    this.setState({ hoveredArtifact });
  };

  _handleArtifactsChange = (activeArtifacts: Array<string>) => {
    this.setState({ activeArtifactNames: activeArtifacts }, this._updateUrl);
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
  }
});

export default App;
