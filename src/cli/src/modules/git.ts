/**
 * Copyright (c) 2019 Paul Armstrong
 */
import spawn from './spawn';

export function isDirty(cwd: string = process.env.cwd): Promise<boolean> {
  return spawn('git', ['status', '-s'], { cwd }).then(
    (buffer: Buffer): boolean => {
      return !/^\s*$/.test(buffer.toString());
    }
  );
}

export function getDefaultBranch(cwd: string = process.env.cwd): Promise<string> {
  return spawn('git', ['symbolic-ref', 'refs/remotes/origin/HEAD'], { cwd }).then(
    (buffer: Buffer): string => {
      return buffer.toString().replace(/^refs\/remotes\/origin/, '');
    }
  );
}

export function getParentRevision(master: string, cwd: string = process.env.cwd): Promise<string> {
  return spawn('git', ['merge-base', 'HEAD', `origin/${master}`], { cwd }).then(
    (buffer: Buffer): string => {
      return buffer.toString();
    }
  );
}

export function getCurrentRevision(cwd: string = process.env.cwd): Promise<string> {
  return spawn('git', ['rev-parse', 'HEAD'], { cwd }).then((buffer: Buffer): string => buffer.toString());
}

interface RevDetails {
  timestamp: number;
  name: string;
  subject: string;
}

export function getRevisionDetails(sha: string, cwd: string = process.env.cwd): Promise<RevDetails> {
  return spawn('git', ['show', '-s', `--format=%ct${0x1f}%aN${0x1f}%s`, sha], { cwd }).then(
    (buffer: Buffer): RevDetails => {
      const [timestamp, name, subject] = buffer.toString().split(`${0x1f}`);
      return {
        timestamp: parseInt(timestamp, 10),
        name,
        subject
      };
    }
  );
}
