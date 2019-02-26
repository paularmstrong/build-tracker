/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as artifactMath from '../artifact-math';

describe('delta', () => {
  test('when the previous is larger, gets a negative value', () => {
    const baseArtifact = { stat: 100 };
    const prevArtifact = { stat: 123 };
    expect(artifactMath.delta('stat', baseArtifact, prevArtifact)).toBe(-23);
  });

  test('when the previous is smaller, gets a positive value', () => {
    const baseArtifact = { gzip: 123 };
    const prevArtifact = { gzip: 100 };
    expect(artifactMath.delta('gzip', baseArtifact, prevArtifact)).toBe(23);
  });

  test('when the artifacts are equal, gets zero', () => {
    const baseArtifact = { brotli: 100 };
    const prevArtifact = { brotli: 100 };
    expect(artifactMath.delta('brotli', baseArtifact, prevArtifact)).toBe(0);
  });

  test('when the baseArtifact is undefined, gets a negative of the prevArtifact', () => {
    const prevArtifact = { stat: 100 };
    expect(artifactMath.delta('stat', undefined, prevArtifact)).toBe(-100);
  });

  test('when the previousArtifact is undefined, gets a positive of the baseArtifact', () => {
    const baseArtifact = { stat: 100 };
    expect(artifactMath.delta('stat', baseArtifact, undefined)).toBe(100);
  });

  test('when both base and previous artifacts are undefined', () => {
    expect(artifactMath.delta('stat')).toBe(0);
  });
});

describe('percentDelta', () => {
  test('when the previous is larger, gets a negative value', () => {
    const baseArtifact = { stat: 86 };
    const prevArtifact = { stat: 100 };
    expect(artifactMath.percentDelta('stat', baseArtifact, prevArtifact)).toBe(-0.14);
  });

  test('when the previous is smaller, gets a positive value', () => {
    const baseArtifact = { gzip: 123 };
    const prevArtifact = { gzip: 100 };
    expect(artifactMath.percentDelta('gzip', baseArtifact, prevArtifact)).toBe(0.23);
  });

  test('when the artifacts are equal, gets zero', () => {
    const baseArtifact = { brotli: 100 };
    const prevArtifact = { brotli: 100 };
    expect(artifactMath.percentDelta('brotli', baseArtifact, prevArtifact)).toBe(0);
  });

  test('when the baseArtifact is undefined, gets a negative of the prevArtifact', () => {
    const prevArtifact = { stat: 100 };
    expect(artifactMath.percentDelta('stat', undefined, prevArtifact)).toBe(-1);
  });

  test('when the previousArtifact is undefined, gets a positive of the baseArtifact', () => {
    const baseArtifact = { stat: 100 };
    expect(artifactMath.percentDelta('stat', baseArtifact, undefined)).toBe(1);
  });

  test('when both base and previous artifacts are undefined', () => {
    expect(artifactMath.percentDelta('stat')).toBe(0);
  });
});
