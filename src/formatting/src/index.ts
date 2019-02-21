/**
 * The kibibyte is a multiple of the unit byte for quantities of digital information.
 * KB is 1000 bytes, but we're accustomed to seeing KB as 1024. That unit is actually KiB.
 * @type {Number}
 */
const BYTES_IN_KIBIBYTE = 1024;

export function formatBytes(bytes: number): string {
  const kib = (Math.round((bytes / BYTES_IN_KIBIBYTE) * 100) / 100).toLocaleString();
  return `${kib} KiB`;
}

export function formatSha(sha: string): string {
  return sha.slice(0, 7);
}
