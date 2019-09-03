/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { createBrowserHistory, createMemoryHistory } from 'history';

export default (canUseDOM ? createBrowserHistory() : createMemoryHistory());
