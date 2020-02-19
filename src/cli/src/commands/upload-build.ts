/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Argv } from 'yargs';
import { handler as createBuild } from './create-build';
import http from 'http';
import https from 'https';
import { URL } from 'url';
import getConfig, { ApiReturn } from '../modules/config';

export const command = 'upload-build';

export const description = 'Upload a build for the current commit';

interface Args {
  branch?: string;
  config?: string;
  out: boolean;
  'skip-dirty-check': boolean;
}

const group = 'Create a build';

export const builder = (yargs): Argv<Args> =>
  yargs
    .usage(`Usage: $0 ${command}`)
    .option('branch', {
      alias: 'b',
      description: 'Set the branch name and do not attempt to read from git',
      group,
      type: 'string'
    })
    .option('config', {
      alias: 'c',
      description: 'Override path to the build-tracker CLI config file',
      group,
      normalize: true
    })
    .option('parent-revision', {
      description: 'Manually provide the parent revision instead of reading it automatically',
      group,
      type: 'string'
    })
    .option('skip-dirty-check', {
      default: false,
      description: 'Skip the git work tree state check',
      group,
      type: 'boolean'
    });

export const handler = async (args: Args): Promise<void> => {
  const config = await getConfig(args.config);
  const build = await createBuild({ ...args, out: false });

  const url = new URL(`${config.applicationUrl}/api/builds`);
  const httpProtocol = config.applicationUrl.startsWith('https:') ? https : http;
  const body = JSON.stringify(build);
  const requestOptions = {
    host: url.hostname.replace(`${httpProtocol}//`, ''),
    port: url.port,
    path: url.pathname,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body)
    }
  };

  if (process.env.BT_API_AUTH_TOKEN) {
    requestOptions.headers['x-bt-auth'] = process.env.BT_API_AUTH_TOKEN;
  }

  return new Promise((resolve, reject) => {
    const req = httpProtocol.request(requestOptions, (res: http.IncomingMessage) => {
      const output = [];
      res.setEncoding('utf8');

      res.on('data', data => {
        output.push(data);
        process.stdout.write(data);
      });

      res.on('end', () => {
        const response = JSON.parse(output.join('')) as ApiReturn;
        if (config.onCompare) {
          config.onCompare(response).then(resolve);
        } else {
          resolve();
        }
      });
    });

    req.on('error', error => {
      process.stderr.write(error.toString());
      reject(error);
    });

    req.write(body);
    req.end();
  });
};
