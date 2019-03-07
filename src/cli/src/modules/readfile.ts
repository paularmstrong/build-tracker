/**
 * Copyright (c) 2019 Paul Armstrong
 */
import brotliSize from 'brotli-size';
import crypto from 'crypto';
import fs from 'fs';
import gzipSize from 'gzip-size';

interface SizeDef {
  hash: string;
  stat: number;
  gzip: number;
  brotli: number;
}

type GetFileNameHash = (fileName: string) => string | void;
const defaultFilenameHash: GetFileNameHash = (): string | void => null;

export default function readfile(filePath: string, getFilenameHash: GetFileNameHash = defaultFilenameHash): SizeDef {
  const stat = fs.statSync(filePath).size;
  const contents = fs.readFileSync(filePath);
  const gzip = gzipSize.sync(contents);
  const brotli = brotliSize.sync(contents);
  let hash = getFilenameHash(filePath);
  if (!hash) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(contents);
    hash = md5sum.digest('hex');
  }
  return { hash, stat, gzip, brotli };
}
