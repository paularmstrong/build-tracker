/**
 * Copyright (c) 2019 Paul Armstrong
 */
import ArtifactDelta from '../ArtifactDelta';
import Build from '@build-tracker/build';
import BuildDelta from '../BuildDelta';

describe('BuildDelta', () => {
  let buildA, buildB;
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1550528708828);

    buildA = new Build(
      {
        branch: 'master',
        revision: { value: '123', url: 'https://build-tracker.local' },
        parentRevision: 'abc',
        timestamp: Date.now()
      },
      [
        { name: 'tacos', hash: '123', sizes: { stat: 2, gzip: 1 } },
        { name: 'burritos', hash: '123', sizes: { stat: 3, gzip: 2 } }
      ]
    );
    buildB = new Build(
      {
        branch: 'master',
        revision: { value: '456', url: 'https://build-tracker.local' },
        parentRevision: 'abc',
        timestamp: Date.now()
      },
      [
        { name: 'tacos', hash: '123', sizes: { stat: 1, gzip: 1 } },
        { name: 'burritos', hash: 'abc', sizes: { stat: 6, gzip: 4 } },
        { name: 'churros', hash: 'abc', sizes: { stat: 6, gzip: 4 } }
      ]
    );
  });

  describe('baseBuild', () => {
    test('gets the base build', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.baseBuild).toBe(buildA);
    });
  });

  describe('prevBuild', () => {
    test('gets the prev build', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.prevBuild).toBe(buildB);
    });
  });

  describe('artifactSizes', () => {
    test('gets a list of size keys available', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.artifactSizes).toEqual(['stat', 'gzip']);
    });

    test('throws an error if builds do not have same artifact size keys', () => {
      const bd = new BuildDelta(
        buildA,
        new Build(
          {
            branch: 'master',
            revision: { value: '123', url: 'https://build-tracker.local' },
            parentRevision: 'abc',
            timestamp: Date.now()
          },
          [{ name: 'tacos', hash: 'abc', sizes: {} }]
        )
      );
      expect(() => bd.artifactSizes).toThrow();
    });
  });

  describe('artifactNames', () => {
    test('gets a set of artifact names', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(Array.from(bd.artifactNames)).toEqual(['tacos', 'burritos', 'churros']);
    });

    test('filters out filtered artifact names', () => {
      const bd = new BuildDelta(buildA, buildB, { artifactFilters: [/churros/] });
      expect(Array.from(bd.artifactNames)).toEqual(['tacos', 'burritos']);
    });
  });

  describe('artifactDeltas', () => {
    test('gets an array of deltas for all artifacts', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.artifactDeltas).toEqual([
        new ArtifactDelta('tacos', [], { gzip: 1, stat: 2 }, { gzip: 1, stat: 1 }, false),
        new ArtifactDelta('burritos', [], { gzip: 2, stat: 3 }, { gzip: 4, stat: 6 }, true),
        new ArtifactDelta('churros', [], { gzip: 0, stat: 0 }, { gzip: 4, stat: 6 }, true)
      ]);
    });

    test('artifact deltas when adding artifacts', () => {
      const bd = new BuildDelta(buildB, buildA);
      expect(bd.artifactDeltas).toEqual([
        new ArtifactDelta('tacos', [], { gzip: 1, stat: 1 }, { gzip: 1, stat: 2 }, false),
        new ArtifactDelta('burritos', [], { gzip: 4, stat: 6 }, { gzip: 2, stat: 3 }, true),
        new ArtifactDelta('churros', [], { gzip: 4, stat: 6 }, { gzip: 0, stat: 0 }, true)
      ]);
    });

    test('respects artifact filters', () => {
      const bd = new BuildDelta(buildA, buildB, { artifactFilters: [/churros/, /burritos/] });
      expect(bd.artifactDeltas).toEqual([
        new ArtifactDelta('tacos', [], { gzip: 1, stat: 2 }, { gzip: 1, stat: 1 }, false)
      ]);
    });
  });

  describe('getArtifactDelta', () => {
    test('gets the delta for a single artifact', () => {
      const bd = new BuildDelta(buildA, buildB);
      expect(bd.getArtifactDelta('tacos')).toEqual(
        new ArtifactDelta('tacos', [], { gzip: 1, stat: 2 }, { gzip: 1, stat: 1 }, false)
      );
    });
  });

  describe('getGroupDelta', () => {
    test('gets the delta for a defined group', () => {
      const bd = new BuildDelta(buildA, buildB, { groups: [{ name: 'stuff', artifactNames: ['burritos', 'tacos'] }] });
      expect(bd.getGroupDelta('stuff')).toEqual(
        new ArtifactDelta('stuff', [], { stat: 5, gzip: 3 }, { stat: 7, gzip: 5 }, true)
      );
    });

    test('calculates sum and hash changes with regex artifact match', () => {
      const bd = new BuildDelta(buildA, buildB, {
        groups: [{ name: 'stuff', artifactNames: ['burritos'], artifactMatch: /^tac/ }]
      });
      expect(bd.getGroupDelta('stuff')).toEqual(
        new ArtifactDelta('stuff', [], { stat: 5, gzip: 3 }, { stat: 7, gzip: 5 }, true)
      );
    });
  });
});
