/**
 * Copyright (c) 2019 Paul Armstrong
 */
import spawn from './spawn';

export function isDirty(cwd: string = process.cwd()): Promise<boolean> {
  return spawn('git', ['status', '-s'], { cwd }).then(
    (buffer: Buffer): boolean => {
      return !/^\s*$/.test(buffer.toString());
    }
  );
}

export function getDefaultBranch(cwd: string = process.cwd()): Promise<string> {
  return spawn('git', ['remote', 'show', 'origin'], { cwd }).then(
    (buffer: Buffer): string => {
      const matches = buffer.toString().match(/HEAD branch: (\S+)/);
      return matches[1];
    }
  );
}

export function getBranch(cwd: string = process.cwd()): Promise<string> {
  return spawn('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd }).then(
    (buffer: Buffer): string => {
      return buffer.toString().trim();
    }
  );
}

export function getParentRevision(branch: string, cwd: string = process.cwd()): Promise<string> {
  return spawn('git', ['merge-base', 'HEAD', `origin/${branch}`], { cwd }).then(
    (buffer: Buffer): string => {
      return buffer.toString().trim();
    }
  );
}

export function getCurrentRevision(cwd: string = process.cwd()): Promise<string> {
  return spawn('git', ['rev-parse', 'HEAD'], { cwd }).then((buffer: Buffer): string => buffer.toString().trim());
}

interface RevDetails {
  timestamp: number;
  name: string;
  subject: string;
}

const SPLIT_POINT = `${0x1f};${0x1f}`;

export function getRevisionDetails(sha: string, cwd: string = process.cwd()): Promise<RevDetails> {
  return spawn('git', ['show', '-s', `--format=%ct${SPLIT_POINT}%aN${SPLIT_POINT}%s`, sha], { cwd }).then(
    (buffer: Buffer): RevDetails => {
      const [timestamp, name, subject] = buffer.toString().split(`${SPLIT_POINT}`);
      return {
        timestamp: parseInt(timestamp, 10),
        name,
        subject
      };
    }
  );
}
