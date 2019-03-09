/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppRegistry } from 'react-native-web';
import Main from '../screens/Main';
import ReactDOMServer from 'react-dom/server';
import { v4 as uuid } from 'uuid';
import { Request, RequestHandler, Response } from 'express';

AppRegistry.registerComponent('App', () => Main);

export function getPageHTML(scripts: Array<string>): string {
  // @ts-ignore
  const { element, getStyleElement } = AppRegistry.getApplication('App', { initialProps: {} });
  const html = ReactDOMServer.renderToString(element);
  const nonce = uuid();
  const css = ReactDOMServer.renderToStaticMarkup(getStyleElement({ nonce }));

  return `
<!DOCTYPE html>
<html style="height:100%">
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
${css}
<body style="height:100%; overflow-y:hidden">
<div id="root" style="display:flex; height: 100%">
${html}
</div>
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

const serverRender = (options: ProdOptions | DevOptions): RequestHandler => (_req: Request, res: Response): void => {
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
  const assets = Array.isArray(assetsByChunkName.app) ? assetsByChunkName.app : [assetsByChunkName.app];
  res.send(getPageHTML(assets));
};

export default serverRender;
