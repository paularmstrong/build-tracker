// @flow
import type { $Request, $Response } from 'express';

export type BranchGetOptions = {
  getBranches: (count?: number) => Promise<Array<string>>
};

type NormalizedQuery = {
  count?: number
};

const normalizeQuery = (query: {}): NormalizedQuery => {
  return Object.keys(query).reduce((memo: NormalizedQuery, key) => {
    const value = query[key];
    switch (key) {
      case 'count':
        memo[key] = parseInt(value, 10);
        break;
      default:
        memo[key] = value;
    }
    return memo;
  }, {});
};

export const handleGet = ({ getBranches }: BranchGetOptions) => (req: $Request, res: $Response) => {
  const query = normalizeQuery(req.query);
  const respondWithJSON = data => {
    res.write(JSON.stringify(data));
    res.end();
  };

  getBranches(query.count).then(respondWithJSON);
};
