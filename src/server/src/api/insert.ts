import Build from '@build-tracker/build';
import Comparator from '@build-tracker/comparator';
import { Request, Response } from 'express';

export default function createInsertBuildHandler(
  getParent: (build: Build) => Promise<Build>,
  onInserted: (comparator: Comparator) => Promise<void> = () => Promise.resolve()
): (req: Request, res: Response) => void {
  return (req: Request, res: Response): void => {
    const { artifacts, meta } = req.body;
    const build = new Build(meta, artifacts);
    getParent(build)
      .then(parentBuild => {
        return new Comparator({ builds: [build, parentBuild] });
      })
      .then(onInserted)
      .then(() => {
        res.send({ foo: 'bar' });
      });
  };
}
