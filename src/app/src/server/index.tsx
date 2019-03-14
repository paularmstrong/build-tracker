/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppRegistry } from 'react-native-web';
import Main from '../screens/Main';
import ReactDOMServer from 'react-dom/server';
import { Request, RequestHandler, Response } from 'express';

AppRegistry.registerComponent('App', () => Main);

export function getPageHTML(nonce: string, props: React.ComponentProps<typeof Main>, scripts: Array<string>): string {
  // @ts-ignore
  const { element, getStyleElement } = AppRegistry.getApplication('App', { initialProps: props });
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
<script nonce="${nonce}">window.__PROPS__=${JSON.stringify(props)}</script>
${scripts.map(script => `<script nonce="${nonce}" src="/client/${script}"></script>`)}
  `;
}

interface Stats {
  assetsByChunkName: { [key: string]: string | Array<string> };
  name: string;
}
interface ProdStats {
  children: Array<Stats>;
}
interface DevStats {
  clientStats: Stats;
}

const getAssetByName = (asset: Array<string> | string): Array<string> => {
  return Array.isArray(asset) ? asset : [asset];
};

const serverRender = (stats: ProdStats | DevStats): RequestHandler => (_req: Request, res: Response): void => {
  const { nonce, url } = res.locals;
  const appStats =
    'clientStats' in stats
      ? stats.clientStats
      : 'children' in stats
      ? stats.children.find(child => child.name === 'client')
      : null;

  if (!appStats) {
    res.status(500);
    res.send('Internal Server Error: no application configured');
    return;
  }

  const { assetsByChunkName } = appStats;
  res.send(
    getPageHTML(nonce, { url }, [...getAssetByName(assetsByChunkName.vendor), ...getAssetByName(assetsByChunkName.app)])
  );
};

export default serverRender;
