/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Build } from './create-build';
import http from 'http';
import https from 'https';
import { ApiReturn, Config } from './config';

export interface Logger {
  log: (input: string) => void;
  error: (input: string) => void;
}

const noop = (): void => {};

export default async function uploadBuild(
  config: Config,
  build: Build,
  apiToken?: string,
  logger: Logger = { log: noop, error: noop }
): Promise<ApiReturn> {
  const { applicationUrl, onCompare } = config;

  const url = new URL(`${applicationUrl}/api/builds`);
  const httpProtocol = applicationUrl.startsWith('https:') ? https : http;
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

  if (apiToken) {
    requestOptions.headers['x-bt-auth'] = apiToken;
  }

  return new Promise((resolve, reject) => {
    const req = httpProtocol.request(requestOptions, (res: http.IncomingMessage) => {
      const output = [];
      res.setEncoding('utf8');

      res.on('data', data => {
        output.push(data);
        logger.log(data);
      });

      res.on('end', () => {
        const response = JSON.parse(output.join(''));
        if (res.statusCode >= 400) {
          reject(new Error(response.error));
        } else {
          const successResponse = response as ApiReturn;
          if (onCompare) {
            onCompare(successResponse).then(() => resolve(successResponse));
          } else {
            resolve(successResponse);
          }
        }
      });
    });

    req.on('error', error => {
      logger.error(error.toString());
      reject(error);
    });

    req.write(body);
    req.end();
  });
}
