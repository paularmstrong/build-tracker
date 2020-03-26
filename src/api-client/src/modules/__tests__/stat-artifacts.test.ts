/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as brotliSize from 'brotli-size';
import config from '@build-tracker/fixtures/cli-configs/rc/.build-trackerrc.js';
import statArtifacts from '../stat-artifacts';

describe('statArtifacts', () => {
  test('gets artifact sizes', () => {
    jest.spyOn(brotliSize, 'sync').mockImplementation(() => {
      throw new Error('disabled in test');
    });
    const artifacts = statArtifacts(config);
    expect(artifacts).toBeInstanceOf(Map);
    expect(artifacts.size).toEqual(3);
    expect(artifacts.get('../../fakedist/main.1234567.js')).toMatchInlineSnapshot(`
      Object {
        "gzip": 74,
        "hash": "764196c430cf8a94c698b74b6dfdad71",
        "stat": 65,
      }
    `);
    expect(artifacts.get('../../fakedist/test-folder/test-no-extension')).toMatchInlineSnapshot(`
      Object {
        "gzip": 54,
        "hash": "415dec15fc798bb79f499aeff00258fb",
        "stat": 34,
      }
    `);
    expect(artifacts.get('../../fakedist/vendor.js')).toMatchInlineSnapshot(`
Object {
  "gzip": 83,
  "hash": "0b3bb1892728da2a8a5af73335a51f35",
  "stat": 83,
}
`);
  });
});
