import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import React from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const features = [
  {
    title: <React.Fragment>Easy setup</React.Fragment>,
    imageUrl: 'img/undraw_server_down_s4lk.svg',
    description: (
      <React.Fragment>
        Use the <code>bt-server</code> command-line utility and many available plugins to quickly configure and deploy a
        Build Tracker instance using your database and hosting of choice.
      </React.Fragment>
    ),
  },
  {
    title: <React.Fragment>Start budgeting</React.Fragment>,
    imageUrl: 'img/undraw_deliveries_131a.svg',
    description: (
      <React.Fragment>
        Build Tracker allows you to easily configure many types of performance budgets to fit your application’s needs.
      </React.Fragment>
    ),
  },
  {
    title: <React.Fragment>Prevent bloat</React.Fragment>,
    imageUrl: 'img/undraw_completed_ngx6.svg',
    description: (
      <React.Fragment>
        Integrate Build Tracker with your CI system to warn or fail pull requests when assets fail your budgets.
      </React.Fragment>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imageUrl ? (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      ) : null}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className={classnames('container', styles.heroContainer)}>
          <div className={styles.heroBoxes}>
            <img src={useBaseUrl('img/logo-animated.svg')} className={styles.heroBox} />
          </div>
          <div className={styles.heroContent}>
            <h1 className="hero__title">
              <span className={classnames(styles.heroFirstLine)}>Track performance budgets</span>{' '}
              <span className={styles.heroAmpersand}>&</span> prevent unexpected{' '}
              <span className={styles.heroBloat}>bloat</span>.
            </h1>
            <div className={styles.buttons}>
              <Link
                className={classnames('button button--outline button--lg', styles.getStarted)}
                to={useBaseUrl('docs/installation')}
              >
                Get Started
              </Link>
              <a
                className={classnames('button button--outline button--lg', styles.getStarted)}
                href="https://build-tracker-demo.herokuapp.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                Demo
              </a>
            </div>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
