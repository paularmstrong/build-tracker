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
