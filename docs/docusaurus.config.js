module.exports = {
  title: 'Build Tracker',
  tagline: 'Track your application’s performance budgets and prevent unexpected bloat.',
  url: 'https://buildtracker.dev',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'paularmstrong', // Usually your GitHub org/user name.
  projectName: 'build-tracker', // Usually your repo name.
  themeConfig: {
    disableDarkMode: true,
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
      ]
    },
    algolia: {
      appId: 'BH4D9OD16A',
      apiKey: '8dd64bd9bb779b8908147f675d6684e7',
      indexName: 'buildtracker',
      algoliaOptions: {}
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
