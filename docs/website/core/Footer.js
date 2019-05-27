/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const { baseUrl, docsUrl } = this.props.config;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const { baseUrl } = this.props.config;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    const { language } = this.props;
    const { baseUrl, copyright, footerIcon, repoUrl, title } = this.props.config;
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={baseUrl} className="nav-home">
            {footerIcon && <img src={baseUrl + footerIcon} alt={title} width="66" height="58" />}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('installation.html', language)}>Getting Started</a>
            <a href={this.docUrl('plugins/plugins.html', language)}>Plugins</a>
          </div>
          <div>
            <h5>Community</h5>
            <a href="http://stackoverflow.com/questions/tagged/build-tracker" target="_blank" rel="noreferrer noopener">
              Stack Overflow
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href={`${baseUrl}blog`}>Blog</a>
            <a href="https://github.com/paularmstrong/build-tracker">GitHub</a>
            <a
              className="github-button"
              href={repoUrl}
              data-icon="octicon-star"
              data-count-href="/paularmstrong/build-tracker/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
          </div>
        </section>

        <section className="copyright">{copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
