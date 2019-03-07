/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { Argv } from 'yargs';

export const command = 'version';

export const description = 'Print the Build Tracker version';

export const builder = (yargs): Argv<{}> => yargs.usage(`Usage: $0 ${command}`);

export const handler = (): void => {
  process.stdout.write(`${require('@build-tracker/cli/package.json').version}\n`);
};
