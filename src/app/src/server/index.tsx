/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppRegistry } from 'react-native-web';
import Main from '../screens/Main';
import ReactDOMServer from 'react-dom/server';
import { Request, RequestHandler, Response } from 'express';

AppRegistry.registerComponent('App', () => Main);

export function getPageHTML(nonce: string, scripts: Array<string>): string {
  // @ts-ignore
  const { element, getStyleElement } = AppRegistry.getApplication('App', { initialProps: {} });
  const html = ReactDOMServer.renderToString(element);
  const css = ReactDOMServer.renderToStaticMarkup(getStyleElement({ nonce }));

  return `<!DOCTYPE html>
<html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<style nonce="${nonce}">html,body{height:100%;overflow-y:hidden;}#root{display:flex;height:100%;}</style>
${css}
<body>
<div id="root">${html}</div>
<div id="menuPortal"></div>
<div id="tooltipPortal"></div>
${scripts.map(script => `<script nonce="${nonce}" src="/client/${script}"></script>`)}
  `;
}

interface Stats {
  assetsByChunkName: { [key: string]: string | Array<string> };
  name: string;
}
interface ProdOptions {
  children: Array<Stats>;
}
interface DevOptions {
  clientStats: Stats;
}

const getAssetByName = (asset: Array<string> | string): Array<string> => {
  return Array.isArray(asset) ? asset : [asset];
};

const serverRender = (options: ProdOptions | DevOptions): RequestHandler => (_req: Request, res: Response): void => {
  const { nonce } = res.locals;
  const stats =
    'clientStats' in options
      ? options.clientStats
      : 'children' in options
      ? options.children.find(child => child.name === 'client')
      : null;

  if (!stats) {
    res.status(500);
    res.send('Internal Server Error: no application configured');
    return;
  }

  const { assetsByChunkName } = stats;
  res.send(getPageHTML(nonce, [...getAssetByName(assetsByChunkName.vendor), ...getAssetByName(assetsByChunkName.app)]));
};

export default serverRender;
