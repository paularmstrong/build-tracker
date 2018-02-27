const assert = require('assert');
const fs = require('fs');
const gzip = require('gzip-size');
const http = require('http');
const https = require('https');
const mkdirp = require('mkdirp');
const path = require('path');
const url = require('url');

class BuildTrackerPlugin {
  constructor({ revision, branch, meta, outputPath, outputUrl }, options) {
    this._revision = revision;
    this._meta = meta || {};
    this._branch = branch;
    this._outputPath = outputPath;
    this._outputUrl = outputUrl;

    this._handleDone = this._handleDone.bind(this);
  }

  apply(compiler) {
    compiler.plugin('done', this._handleDone);
  }

  _handleDone(artifacts) {
    const compilation = artifacts.compilation;

    const outputArtifacts = compilation.chunks
      .map(chunk => {
        const fileName = chunk.files.filter(fileName => /\.js$/.test(fileName))[0];
        const filePath = path.join(compilation.outputOptions.path, fileName);

        try {
          const file = fs.readFileSync(filePath);
          const gzippedSize = gzip.sync(file);
          return {
            hash: chunk.hash,
            name: chunk.name,
            stat: chunk.size({}),
            gzip: gzippedSize
          };
        } catch (e) {
          return;
        }
      })
      .filter(Boolean)
      .reduce((memo, artifact) => Object.assign({}, memo, { [artifact.name]: artifact }), {});

    const output = {
      meta: Object.assign({}, this._meta, {
        revision: this._revision,
        branch: this._branch,
        timestamp: Date.now()
      }),
      artifacts: outputArtifacts
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
    const fileTitle = ['build', this._branch, this._revision].filter(Boolean).join('-');
    const outputFilePath = path.join(this._outputPath, `${fileTitle}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(output));
  }

  _post(output) {
    const parsedUrl = url.parse(this._outputUrl);
    assert(
      parsedUrl.protocol && /^https?/.test(parsedUrl.protocol),
      `Expected "${this._outputUrl}" to start with http or https`
    );

    const data = JSON.stringify(output);
    const requestOptions = Object.assign({}, parsedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    });

    const httpModule = requestOptions.protocol === 'https:' ? https : http;

    const request = httpModule.request(requestOptions, response => {
      response.setEncoding('utf8');
      let resBody = '';
      response.on('data', chunk => {
        resBody += chunk;
      });
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 400) {
          console.error(
            `Failed to post build status to URL: ${response.statusCode} - ${response.statusMessage} - ${resBody}`
          );
        }
      });
    });

    request.write(data);
    request.end();
  }
}

module.exports = BuildTrackerPlugin;
