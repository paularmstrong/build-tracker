// eslint-disable-next-line header/header
import Build from '@build-tracker/build';
import { BuildMetaItem } from '@build-tracker/build';
import { Config } from './config';
import http from 'http';
import https from 'https';

export interface Logger {
  log: (input: string) => void;
  error: (input: string) => void;
}

const noop = (): void => {};

export default async function getBuild(
  config: Config,
  revision: BuildMetaItem,
  logger: Logger = { log: noop, error: noop }
): Promise<Build> {
  const { applicationUrl } = config;

  // Call through to api/build/:revision
  const url = new URL(`${applicationUrl}/api/builds/${revision}`);
  const httpProtocol = applicationUrl.startsWith('https:') ? https : http;
  const requestOptions = {
    host: url.hostname.replace(`${httpProtocol}//`, ''),
    port: url.port,
    path: url.pathname,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    const req = httpProtocol.request(requestOptions, (res: http.IncomingMessage) => {
      const output = [];
      res.setEncoding('utf8');

      res.on('data', (data) => {
        output.push(typeof data === 'string' ? data : data.toString());
      });

      res.on('end', async () => {
        const response = JSON.parse(output.join(''));
        if (res.statusCode >= 400) {
          logger.error(response.error);
          reject(new Error(response.error));
          return;
        }

        const successResponse = Build.fromJSON(response);
        logger.log(JSON.stringify(successResponse));
        resolve(successResponse);
      });
    });

    req.on('error', (error: Error) => {
      logger.error(error.toString());
      reject(error);
    });

    req.end();
  });
}
