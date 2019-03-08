/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as path from 'path';
import getConfig from '../config';

const commonjsConfig = require(path.join(
  path.dirname(require.resolve('@build-tracker/fixtures')),
  'cli-configs/commonjs/build-tracker.config.js'
));
const rcConfig = require(path.join(
  path.dirname(require.resolve('@build-tracker/fixtures')),
  'cli-configs/rc/.build-trackerrc.js'
));

describe('getConfig', () => {
  test('found via cosmiconfig when not provided', () => {
    jest
      .spyOn(process, 'cwd')
      .mockReturnValue(path.join(path.dirname(require.resolve('@build-tracker/fixtures')), 'cli-configs/commonjs'));
    return getConfig().then(result => {
      expect(result).toEqual(commonjsConfig);
    });
  });

  test('loaded via cosmiconfig when provided', () => {
    return getConfig(
      path.join(path.dirname(require.resolve('@build-tracker/fixtures')), 'cli-configs/rc/.build-trackerrc.js')
    ).then(result => {
      expect(result).toMatchObject(rcConfig);
    });
  });

  test('throws if no configuration found', () => {
    return getConfig('tacos').catch(e => {
      expect(e.message).toMatch('Could not find configuration file');
    });
  });
});
