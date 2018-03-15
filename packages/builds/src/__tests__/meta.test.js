// @flow
// eslint-env jest
import * as BuildMeta from '../meta';

const build = {
  meta: {
    timestamp: 12345678,
    revision: '123456789',
    branch: 'master',
    tacos: 'yes please'
  },
  artifacts: {}
};

const buildWithLinks = {
  ...build,
  meta: {
    ...build.meta,
    revision: { value: '123456789', url: 'https://example.com' },
    branch: { value: 'master', url: 'https://example.com' },
    tacos: { value: 'yes please', url: 'https://example.com' }
  }
};

describe('BuildMeta', () => {
  describe('getMetaValue', () => {
    test('gets the value', () => {
      expect(BuildMeta.getMetaValue(build.meta.tacos)).toBe(build.meta.tacos);
    });

    test('gets the value when paired with a URL', () => {
      // $FlowFixMe flow can't figure out
      expect(BuildMeta.getMetaValue(buildWithLinks.meta.tacos)).toBe(buildWithLinks.meta.tacos.value);
    });
  });

  describe('getMetaUrl', () => {
    test('gets the value', () => {
      expect(BuildMeta.getMetaUrl(build.meta.tacos)).toBeUndefined();
    });

    test('gets the value when paired with a URL', () => {
      // $FlowFixMe flow can't figure out
      expect(BuildMeta.getMetaUrl(buildWithLinks.meta.tacos)).toBe(buildWithLinks.meta.tacos.url);
    });
  });

  describe('getValue', () => {
    test('gets the value', () => {
      expect(BuildMeta.getValue(build, 'tacos')).toBe(build.meta.tacos);
    });

    test('gets the value when paired with a URL', () => {
      // $FlowFixMe flow can't figure out
      expect(BuildMeta.getValue(buildWithLinks, 'tacos')).toBe(buildWithLinks.meta.tacos.value);
    });
  });

  describe('getUrl', () => {
    test('gets the value', () => {
      expect(BuildMeta.getUrl(build, 'tacos')).toBeUndefined();
    });

    test('gets the value when paired with a URL', () => {
      // $FlowFixMe flow can't figure out
      expect(BuildMeta.getUrl(buildWithLinks, 'tacos')).toBe(buildWithLinks.meta.tacos.url);
    });
  });

  describe('getRevision', () => {
    test('gets the value', () => {
      expect(BuildMeta.getRevision(build)).toBe(build.meta.revision);
    });

    test('gets the value when paired with a URL', () => {
      // $FlowFixMe flow can't figure out
      expect(BuildMeta.getRevision(buildWithLinks)).toBe(buildWithLinks.meta.revision.value);
    });
  });

  describe('getTimestamp', () => {
    test('gets the value', () => {
      expect(BuildMeta.getTimestamp(build)).toBe(build.meta.timestamp);
    });
  });

  describe('getDate', () => {
    test('gets the date', () => {
      expect(BuildMeta.getDate(build)).toEqual(new Date(build.meta.timestamp));
    });
  });

  describe('getBranch', () => {
    test('gets the value', () => {
      expect(BuildMeta.getBranch(build)).toBe(build.meta.branch);
    });

    test('gets the value when paired with a URL', () => {
      // $FlowFixMe flow can't figure out
      expect(BuildMeta.getBranch(buildWithLinks)).toBe(buildWithLinks.meta.branch.value);
    });
  });
});
