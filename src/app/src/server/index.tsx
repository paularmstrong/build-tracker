/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { AppRegistry } from 'react-native-web';
import Favicon from '../images/favicon.png';
import Main from '../screens/Main';
import makeStore from '../store';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { searchParamsToStore } from '../store/utils';
import { Store } from 'redux';
import toSource from 'tosource';
import { Actions, State } from '../store/types';
import { Request, RequestHandler, Response } from 'express';

interface AppProps {
  store: Store<State, Actions>;
}

const App = (props: AppProps): React.ReactElement => (
  <Provider store={props.store}>
    <Main />
  </Provider>
);

AppRegistry.registerComponent('App', () => App);

export function getPageHTML(nonce: string, state: Partial<State>, scripts: Array<string>): string {
  const store = makeStore(state);
  const { name } = store.getState();

  const { element, getStyleElement } = AppRegistry.getApplication('App', { initialProps: { store } });
  const html = ReactDOMServer.renderToString(element);
  const css = ReactDOMServer.renderToStaticMarkup(getStyleElement({ nonce }));

  return `<!DOCTYPE html>
<html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${name === 'Build Tracker' ? name : `${name} : Build Tracker`}</title>
<link rel="shortcut icon" href="${Favicon}">
<style nonce="${nonce}">html,body{height:100%;overflow-y:hidden;}#root{display:flex;height:100%;}</style>
${css}
<body>
<div id="root">${html}</div>
<div id="menuPortal"></div>
<div id="tooltipPortal"></div>
<div id="snackbarPortal"></div>
<script nonce="${nonce}">window.__PROPS__=${toSource(state, null, false)}</script>
${scripts.map((script) => `<script nonce="${nonce}" src="/client/${script}"></script>`).join('')}
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

const serverRender = (stats: ProdStats | DevStats): RequestHandler => (req: Request, res: Response): void => {
  const { nonce, props } = res.locals;
  const appStats =
    'clientStats' in stats
      ? stats.clientStats
      : 'children' in stats
      ? stats.children.find((child) => child.name === 'client')
      : null;

  if (!appStats) {
    res.status(500);
    res.send('Internal Server Error: no application configured');
    return;
  }

  const state = { ...props, ...searchParamsToStore(req.originalUrl.split('?')[1] || '') };

  const { assetsByChunkName } = appStats;
  res.send(
    getPageHTML(
      nonce,
      state,
      [...getAssetByName(assetsByChunkName.vendor), ...getAssetByName(assetsByChunkName.app)].filter(Boolean)
    )
  );
};

export default serverRender;
