// @flow
import * as React from 'react';
import type { BT$AppConfig } from '@build-tracker/types';
import merge from 'deepmerge';
import { object } from 'prop-types';

type ContextProps = {
  config: BT$AppConfig,
  children: React.Node
};

const defaultConfig = {
  artifactFilters: [],
  thresholds: {
    stat: 5000,
    statPercent: 0.1,
    gzip: 500,
    gzipPercent: 0.05
  }
};

export default class ContextProvider extends React.Component<ContextProps> {
  static childContextTypes = {
    config: object
  };

  getChildContext() {
    const { config: { artifactFilters, ...config } } = this.props;
    const regexFilters = artifactFilters
      ? artifactFilters.map(filter => {
          if (typeof filter === 'string') {
            const flags = filter.match(/\/([gimu]*)$/);
            const normalizedFilter = filter.replace(/^\//, '').replace(/\/[gimu]*$/, '');
            return new RegExp(normalizedFilter, flags.length ? flags[1] : undefined);
          }
          return filter;
        })
      : [];
    return {
      config: merge.all([defaultConfig, config, { artifactFilters: regexFilters }])
    };
  }

  render() {
    return this.props.children;
  }
}
