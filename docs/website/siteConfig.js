/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
// const users = [
//   {
//     caption: 'User1',
//     // You will need to prepend the image path with your baseUrl
//     // if it is not '/', like: '/test-site/img/logo.svg'.
//     image: '/img/logo.svg',
//     infoLink: 'https://www.facebook.com',
//     pinned: true
//   }
// ];

const siteConfig = {
  title: 'Build Tracker',
  tagline: "Track your application's performance budgets",
  url: 'https://buildtracker.dev',
  cname: 'buildtracker.dev',
  baseUrl: '/',

  editUrl: 'https://github.com/paularmstrong/build-tracker/tree/next/docs/docs/',

  // Used for publishing and more
  projectName: 'build-tracker',
  organizationName: 'paularmstrong',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'installation', label: 'Docs' },
    { href: 'https://build-tracker-demo.herokuapp.com', label: 'Demo' },
    { href: 'https://github.com/paularmstrong/build-tracker', label: 'GitHub' },
    { blog: true, label: 'Blog' }
  ],

  // If you have users set above, you add it here:
  users: [],

  /* path to images for header/footer */
  headerIcon: 'img/logo.svg',
  footerIcon: 'img/logo.svg',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#12346C',
    secondaryColor: '#3D6DA2'
  },

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Paul Armstrong`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'tomorrow-night'
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/ogImage.png',
  twitterImage: 'img/logo.png',

  // Show documentation's last contributor's name.
  enableUpdateBy: true,

  // Show documentation's last update time.
  enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/paularmstrong/build-tracker/docs'
};

module.exports = siteConfig;
