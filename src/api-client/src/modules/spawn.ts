/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { spawn as nodeSpawn, SpawnOptions } from 'child_process';

export default function spawn(command: string, args?: ReadonlyArray<string>, options?: SpawnOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const proc = nodeSpawn(command, args, options);
    const errors = {
      spawn: null,
      stdout: null,
      stderr: null
    };

    const stderr: Array<Buffer> = [];
    const stdout: Array<Buffer> = [];

    proc.on('error', error => {
      errors.spawn = error;
    });

    proc.stdout.on('error', error => {
      errors.stdout = error;
    });

    proc.stderr.on('error', error => {
      errors.stderr = error;
    });

    proc.stderr.on('data', data => {
      stderr.push(data);
    });

    proc.stdout.on('data', data => {
      stdout.push(data);
    });

    proc.on('close', code => {
      if (code !== 0) {
        return reject({ code, stderr: Buffer.concat(stderr).toString(), errors });
      }
      resolve(Buffer.concat(stdout));
    });
  });
}
