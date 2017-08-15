// @flow
import BundleSwitch from './BundleSwitch';
import deepEqual from 'deep-equal';
import IconX from './icons/IconX';
import theme from './theme';
import { bytesToKb, formatSha } from './formatting';
import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from './Table';
import { scaleLinear } from 'd3-scale';
import { interpolateHcl } from 'd3-interpolate';
import { rgb } from 'd3-color';

import type { Build } from './types';

const emptyObject = {};

const flatten = (arrays: Array<any>) => arrays.reduce((memo: Array<any>, b: any) => memo.concat(b), []);

const greenScale = scaleLinear().domain([1, 0]).interpolate(interpolateHcl).range([rgb('#d0f8d7'), rgb('#55e86e')]);
const redScale = scaleLinear().domain([1, 2]).interpolate(interpolateHcl).range([rgb('#fde2e1'), rgb('#f7635b')]);

const getDeltaColor = (originalValue, newValue) => {
  if (originalValue === newValue) {
    return 'transparent';
  }
  if (!originalValue) {
    return redScale(2);
  }
  if (!newValue) {
    return greenScale(1);
  }

  const percentDiff = Math.abs(newValue / originalValue);
  return percentDiff > 1
    ? redScale(Math.max(Math.min(percentDiff, 2), 1))
    : greenScale(Math.max(Math.min(percentDiff, 1), 0));
};

const getTableHeaders = (builds: Array<Build>) =>
  builds.map((build, i) => {
    const { revision } = build.build;
    const headers = [{ text: revision, removable: true }];
    if (i > 0) {
      headers.push({ text: '𝚫', title: 'Change from previous selected build' });
    }
    if (i > 1) {
      headers.push({ text: '𝚫0', title: 'Change from first selected build' });
    }
    return headers;
  });

const getTableBody = (bundles: Array<string>, builds: Array<Build>, valueAccessor: Function) => {
  const bundleMap = bundles.map((bundle, i) => {
    const originalValue = builds.length ? valueAccessor(builds[0].stats[bundle]) : 0;
    return [
      { link: `/${bundle}`, text: bundle },
      ...builds.map((build, i) => {
        const value = valueAccessor(build.stats[bundle]);
        if (i === 0) {
          return [{ bytes: value }];
        }
        const oldValue = valueAccessor(builds[i - 1].stats[bundle]);
        const delta = value - oldValue;
        const values = [{ bytes: value }, { bytes: delta, color: getDeltaColor(oldValue, value) }];
        if (i > 1) {
          values.push({ bytes: value - originalValue, color: getDeltaColor(originalValue, value) });
        }
        return values;
      })
    ];
  });

  return [getTotals(builds, valueAccessor), ...bundleMap];
};

const getTotals = (builds: Array<Build>, valueAccessor: Function) => {
  const totals = builds.map(build =>
    Object.values(build.stats).reduce((memo, bundle) => memo + valueAccessor(bundle), 0)
  );

  const totalsWithDelta = totals.map((total, i) => {
    if (i === 0) {
      return [{ bytes: total }];
    }
    const bytes = total - totals[i - 1];
    const values = [{ bytes: total }, { bytes, color: getDeltaColor(totals[i - 1], total) }];
    if (i > 1) {
      const bytes = total - totals[0];
      values.push({ bytes, color: getDeltaColor(totals[0], total) });
    }
    return values;
  });

  return [{ link: '/', text: 'All' }, ...totalsWithDelta];
};

const createTableData = (bundles: Array<string>, builds: Array<Build>, valueAccessor: Function) => {
  return {
    head: [[{}], ...getTableHeaders(builds)],
    body: getTableBody(bundles, builds, valueAccessor)
  };
};

class Heading extends PureComponent {
  props: {
    onClickInfo?: Function,
    onClickRemove?: Function,
    text: string,
    title?: string
  };

  static defaultProps = {
    text: ''
  };

  render() {
    const { onClickRemove, text, title } = this.props;
    return (
      <Th style={[styles.cell, styles.header]} title={title}>
        {onClickRemove
          ? <View style={styles.headerContent}>
              <Text onClick={this._handleClickInfo} style={styles.headerSha}>
                {formatSha(text)}
              </Text>
              <View onClick={this._handleClickRemove} style={[styles.headerButton, styles.removeBuild]}>
                <IconX />
              </View>
            </View>
          : text}
      </Th>
    );
  }

  _handleClickRemove = () => {
    const { onClickRemove, text } = this.props;
    onClickRemove && onClickRemove(text);
  };

  _handleClickInfo = () => {
    const { onClickInfo, text } = this.props;
    onClickInfo && onClickInfo(text);
  };
}

const BundleCell = props =>
  <Th style={[styles.cell, styles.rowHeader, styles.stickyColumn]}>
    <BundleSwitch {...props} />
  </Th>;

class ValueCell extends PureComponent {
  props: {
    bytes: number,
    color?: string,
    colSpan?: number
  };

  static defaultProps = {
    colSpan: 1
  };

  render() {
    const { bytes, color, colSpan } = this.props;
    return (
      <Td colSpan={colSpan} style={[styles.cell, color ? { backgroundColor: color } : emptyObject]}>
        {bytes ? bytesToKb(bytes) : '-'}
      </Td>
    );
  }
}

export default class Comparisons extends PureComponent {
  props: {
    activeBundles: Array<string>,
    builds: Array<Build>,
    bundles: Array<string>,
    colorScale: Function,
    onBundlesChange?: Function,
    onRemoveBuild?: Function,
    onShowBuildInfo?: Function,
    valueAccessor: Function
  };

  state: {
    showDeselectedBundles: boolean
  };

  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {
      showDeselectedBundles: true
    };
    this._data = createTableData(props.bundles, props.builds, props.valueAccessor);
  }

  componentWillUpdate(nextProps, nextState) {
    this._data = createTableData(nextProps.bundles, nextProps.builds, nextProps.valueAccessor);
  }

  render() {
    const { activeBundles, builds, bundles, colorScale, onRemoveBuild, onShowBuildInfo } = this.props;

    const { showDeselectedBundles } = this.state;

    const body = showDeselectedBundles ? this._data.body : this._getActiveData();
    const hiddenRowCount = this._data.body.length - body.length;
    const headers = flatten(this._data.head);

    return (
      <View style={styles.root}>
        <Table style={styles.dataTable}>
          <Thead>
            <Tr>
              {headers.map((column, i) =>
                <Heading
                  {...column}
                  key={i}
                  onClickRemove={column.removable && onRemoveBuild}
                  onClickInfo={column.removable && onShowBuildInfo}
                />
              )}
            </Tr>
          </Thead>
          <Tbody>
            {body.length
              ? body.map((row, i) =>
                  <Tr key={i}>
                    {flatten(row).map((column, i) => {
                      if (i === 0) {
                        const { link, text } = column;
                        const isAll = text === 'All';
                        return (
                          <BundleCell
                            active={
                              isAll ? activeBundles.length === bundles.length : activeBundles.indexOf(text) !== -1
                            }
                            color={isAll ? theme.colorMidnight : colorScale(1 - bundles.indexOf(text))}
                            disabled={isAll && activeBundles.length === bundles.length}
                            key={i}
                            onToggle={isAll ? this._handleToggleAllBundles : this._handleToggleBundle}
                            bundleName={text}
                            link={link}
                          />
                        );
                      }
                      return <ValueCell {...column} key={i} />;
                    })}
                  </Tr>
                )
              : null}
          </Tbody>
          {builds.length > 1
            ? <Tfoot>
                <Tr>
                  <BundleCell
                    active={deepEqual(this._getFilteredData().map(row => row[0].text).slice(1), activeBundles)}
                    bundleName="Above threshold only"
                    color={theme.colorMidnight}
                    onToggle={this._handleRemoveBelowThreshold}
                  />
                  <Td colSpan={headers.length - 1} style={styles.footer} />
                </Tr>
                <Tr>
                  <BundleCell
                    active={!hiddenRowCount}
                    bundleName="Show deselected"
                    color={theme.colorMidnight}
                    onToggle={this._handleHideBelowThreshold}
                  />
                  <Td colSpan={headers.length - 1} style={styles.footer} />
                </Tr>
              </Tfoot>
            : null}
        </Table>
      </View>
    );
  }

  _getActiveData() {
    const { activeBundles } = this.props;
    return this._data.body.filter((row, i) => {
      return i === 0 || activeBundles.indexOf(row[0].text) !== -1;
    });
  }

  _getFilteredData() {
    return this._data.body.filter((row, i) => {
      const deltas = row.filter(columns => columns.length > 1 && Math.abs(columns[1].bytes) > 100);
      if (i !== 0 && row.length > 2 && deltas.length === 0) {
        return false;
      }
      return true;
    });
  }

  _handleHideBelowThreshold = (name: string, toggled: boolean) => {
    this.setState({ showDeselectedBundles: toggled });
  };

  _handleRemoveBelowThreshold = (name: string, toggled: boolean) => {
    const { bundles, onBundlesChange } = this.props;
    if (toggled) {
      const data = this._getFilteredData();
      onBundlesChange(data.map(row => row[0].text));
    } else {
      onBundlesChange(bundles);
    }
  };

  _handleToggleBundle = (bundleName: string, value: boolean) => {
    const { activeBundles, onBundlesChange } = this.props;
    if (onBundlesChange) {
      if (value) {
        onBundlesChange([...activeBundles, bundleName]);
      } else {
        onBundlesChange(activeBundles.filter(b => b !== bundleName));
      }
    }
  };

  _handleToggleAllBundles = (value: boolean) => {
    const { bundles, onBundlesChange } = this.props;
    onBundlesChange && onBundlesChange(bundles);
  };
}

const styles = StyleSheet.create({
  root: {
    position: 'relative'
  },
  dataTable: {
    fontSize: theme.fontSizeSmall,
    borderSpacing: 0,
    borderCollapse: 'separate'
  },
  header: {
    position: 'sticky',
    top: 0,
    left: 'auto',
    zIndex: 2
  },
  rowHeader: {
    textAlign: 'left',
    paddingRight: theme.spaceXXSmall
  },
  rowColor: {
    display: 'inline-flex',
    width: '1em',
    height: '1em',
    borderRadius: '50%',
    marginLeft: theme.spaceXSmall
  },
  bundleLink: {
    display: 'inline-flex',
    fontWeight: 'normal'
  },
  cell: {
    backgroundColor: theme.colorWhite,
    margin: 0,
    paddingLeft: theme.spaceXSmall,
    paddingRight: theme.spaceXSmall,
    verticalAlign: 'middle',
    height: theme.spaceLarge,
    textAlign: 'right',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: theme.colorGray,
    whiteSpace: 'nowrap'
  },
  toggle: {
    color: theme.colorBlue,
    cursor: 'pointer'
  },
  footer: {
    textAlign: 'center'
  },
  footerText: {
    display: 'inline'
  },
  stickyColumn: {
    left: 0,
    position: 'sticky',
    top: 'auto',
    maxWidth: '13rem',
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: theme.colorGray
  },
  headerContent: {
    flexDirection: 'row'
  },
  headerSha: {
    cursor: 'pointer'
  },
  headerButton: {
    marginLeft: theme.spaceXSmall,
    cursor: 'pointer',
    fontSize: '0.5rem'
  },
  removeBuild: {
    color: theme.colorRed
  }
});
