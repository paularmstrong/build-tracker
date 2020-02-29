module.exports = {
  title: 'Build Tracker',
  tagline: 'Track your application’s performance budgets and prevent unexpected bloat.',
  url: 'https://buildtracker.dev',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'paularmstrong', // Usually your GitHub org/user name.
  projectName: 'build-tracker', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Build Tracker',
      logo: {
        alt: 'Build Tracker Logo',
        src: 'img/logo.svg'
      },
      links: [
        { to: 'docs/installation', label: 'Docs', position: 'left' },
        { to: 'docs/guides/guides', label: 'Guides', position: 'left' },
        { to: 'blog', label: 'Blog', position: 'right' },
        {
          href: 'https://github.com/paularmstrong/build-tracker',
          label: 'GitHub',
          position: 'right'
        }
      ],
      algolia: {
        apiKey: process.env.ALGOLIA_API_KEY,
        indexName: 'buildtracker',
        algoliaOptions: {}
      }
    },
    footer: {
      logo: { src: 'img/logo.svg', alt: '' },
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting started',
              to: 'docs/installation'
            },
            {
              label: 'Plugins',
              to: 'docs/plugins/plugins'
            }
          ]
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'http://stackoverflow.com/questions/tagged/build-tracker'
            }
          ]
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              to: 'blog'
            },
            {
              label: 'GitHub',
              href: 'https://github.com/paularmstrong/build-tracker'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Paul Armstrong`
    },
    // Open Graph and Twitter card images.
    image: 'img/ogImage.png'
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/paularmstrong/build-tracker/edit/next/docs/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
};
