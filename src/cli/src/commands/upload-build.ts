/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Argv } from 'yargs';
import http from 'http';
import https from 'https';
import { URL } from 'url';
import { Args as BuildArgs, handler as createBuildHandler, getBuildOptions } from './create-build';
import getConfig, { ApiReturn } from '../modules/config';

export const command = 'upload-build';

export const description = 'Upload a build for the current commit';

type Args = BuildArgs;

export const builder = (yargs): Argv<Args> => getBuildOptions(yargs).usage(`Usage: $0 ${command}`);

export const handler = async (args: Args): Promise<void> => {
  const config = await getConfig(args.config);
  const build = await createBuildHandler({ ...args, out: false });

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
        const response = JSON.parse(output.join(''));
        if (res.statusCode >= 400) {
          reject(new Error(response.error));
        } else {
          const successResponse = response as ApiReturn;
          if (config.onCompare) {
            config.onCompare(successResponse).then(resolve);
          } else {
            resolve();
          }
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
