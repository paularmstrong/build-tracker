const assert = require('assert');
const fs = require('fs');
const gzipSize = require('gzip-size');
const http = require('http');
const https = require('https');
const mkdirp = require('mkdirp');
const path = require('path');
const querystring = require('querystring');
const url = require('url');

class AnalyzerStatsPlugin {
  constructor({ buildRevision, buildBranch, meta, outputPath, outputUrl }, options) {
    this._revision = buildRevision;
    this._meta = meta || {};
    this._branch = buildBranch;
    this._outputPath = outputPath;
    this._outputUrl = outputUrl;

    this._handleDone = this._handleDone.bind(this);
  }

  apply(compiler) {
    compiler.plugin('done', this._handleDone);
  }

  _handleDone(stats) {
    const compilation = stats.compilation;
    const fileNameFormat = compilation.outputOptions.chunkFilename;
    let hashLength = fileNameFormat.match(/\[chunkhash\:(\d+)\]/);
    if (hashLength && hashLength.length) {
      hashLength = parseInt(hashLength[1], 10);
    }

    const outputStats = compilation.chunks
      .map(chunk => {
        const fileName = fileNameFormat
          .replace('[name]', chunk.name)
          .replace(/\[chunkhash\:\d+\]/, chunk.hash.slice(0, hashLength));
        const filePath = path.join(compilation.outputOptions.path, fileName);

        try {
          const file = fs.readFileSync(filePath);
          const gzippedSize = gzipSize.sync(file);
          return {
            hash: chunk.hash,
            name: chunk.name,
            size: chunk.size({}),
            gzipSize: gzippedSize
          };
        } catch (e) {
          return;
        }
      })
      .filter(Boolean);

    const output = {
      meta: {
        ...meta,
        revision: this._revision,
        branch: this._branch,
        timestamp: Date.now()
      },
      stats: outputStats
    };

    if (this._outputPath) {
      this._write(output);
    }

    if (this._outputUrl) {
      this._post(output);
    }
  }

  _write(output) {
    mkdirp.sync(this._outputPath);
    const fileTitle = ['stats', this._branch, this._revision].filter(Boolean).join('-');
    const outputFilePath = path.join(this._outputPath, `${fileTitle}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(output));
  }

  _post(output) {
    const parsedUrl = url.parse(this._outputUrl);
    assert(
      parsedUrl.protocol && /^https?/.test(parsedUrl.protocol),
      `Expected "${this._outputUrl}" to start with http or https`
    );

    const data = querystring.stringify(output);
    const requestOptions = Object.assign({}, parsedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      }
    });

    let httpModule = requestOptions.protocol === 'https:' ? https : http;

    const request = httpModule.request(requestOptions, response => {
      if (response.statusCode < 200 || response.statusCode >= 400) {
        throw new Error(`Failed to post stats to URL: ${response.statusCode} - ${response.statusMessage}`);
        process.exit(1);
      }
    });

    request.write(data);
    request.end();
  }
}

module.exports = AnalyzerStatsPlugin;
