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
        "gzip": 73,
        "hash": "631a500f31d7602a386b4f858338dd6f",
        "stat": 64,
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
        "gzip": 82,
        "hash": "fc4bcd175441f89862f9d81e37599416",
        "stat": 82,
      }
    `);
  });
});
