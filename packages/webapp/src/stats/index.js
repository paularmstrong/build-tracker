import stats1bf811ec249c2b13a314e127312b2d760f6658e2 from './stats-1bf811ec249c2b13a314e127312b2d760f6658e2.json';
import stats5113828d6b0e628a78fa383a53933c413b6bdbef from './stats-5113828d6b0e628a78fa383a53933c413b6bdbef.json';
import stats703baac11f1be4b2d02ddb89de6789c7605183b0 from './stats-703baac11f1be4b2d02ddb89de6789c7605183b0.json';
import stats7f68d84c59b4604ecd88943eae4a88a41b137ed6 from './stats-7f68d84c59b4604ecd88943eae4a88a41b137ed6.json';
import stats8de1726f26559b4191f4826817df64baff07711d from './stats-8de1726f26559b4191f4826817df64baff07711d.json';
import stats90aedcf89f12d2013f58105e0b1493e85c72e92c from './stats-90aedcf89f12d2013f58105e0b1493e85c72e92c.json';
import statsb4098b3a46c207924e1e9edfa22fc21960524c72 from './stats-b4098b3a46c207924e1e9edfa22fc21960524c72.json';
import statsbf4c66a3ee2a8c8355f8bd1c207593d32fa29d6b from './stats-bf4c66a3ee2a8c8355f8bd1c207593d32fa29d6b.json';
import statsd691af0754ce7dcc08c76a1ed2d8259962cb9d1d from './stats-d691af0754ce7dcc08c76a1ed2d8259962cb9d1d.json';

const stats = [
  stats1bf811ec249c2b13a314e127312b2d760f6658e2,
  stats5113828d6b0e628a78fa383a53933c413b6bdbef,
  stats703baac11f1be4b2d02ddb89de6789c7605183b0,
  stats7f68d84c59b4604ecd88943eae4a88a41b137ed6,
  stats8de1726f26559b4191f4826817df64baff07711d,
  stats90aedcf89f12d2013f58105e0b1493e85c72e92c,
  statsb4098b3a46c207924e1e9edfa22fc21960524c72,
  statsbf4c66a3ee2a8c8355f8bd1c207593d32fa29d6b,
  statsd691af0754ce7dcc08c76a1ed2d8259962cb9d1d
].sort((a, b) => a.build.timestamp < b.build.timestamp);

export const getBundles = () =>
  stats
    .reduce((memo, commit) => {
      const bundles = commit.stats.map(bundle => bundle.name);
      console.log(bundles);
      memo = memo.concat(bundles).filter((value, index, self) => self.indexOf(value) === index);
      return memo;
    }, [])
    .sort();
