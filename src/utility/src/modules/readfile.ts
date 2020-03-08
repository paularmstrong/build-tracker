/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as brotliSize from 'brotli-size';
import crypto from 'crypto';
import fs from 'fs';
import gzipSize from 'gzip-size';

interface SizeDef {
  brotli?: number;
  gzip: number;
  hash: string;
  stat: number;
}

type GetFileNameHash = (fileName: string) => string | void;
const defaultFilenameHash: GetFileNameHash = (): string | void => null;

export default function readfile(filePath: string, getFilenameHash: GetFileNameHash = defaultFilenameHash): SizeDef {
  const stat = fs.statSync(filePath).size;
  const contents = fs.readFileSync(filePath);
  const gzip = gzipSize.sync(contents);

  let hash = getFilenameHash(filePath);
  if (!hash) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(contents);
    hash = md5sum.digest('hex');
  }

  const output: SizeDef = { stat, gzip, hash };

  try {
    output.brotli = brotliSize.sync(contents);
  } catch (e) {}

  return output;
}
