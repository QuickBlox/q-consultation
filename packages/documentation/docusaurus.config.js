// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Q-Consultation Lite Documentation',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://quickblox.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/q-consultation/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'QuickBlox', // Usually your GitHub org/user name.
  projectName: 'q-consultation', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/QuickBlox/q-consultation/tree/master/packages/documentation/',
          docLayoutComponent: "@theme/DocPage",
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
    [
      'redocusaurus',
      {
        specs: [
          {
            spec: 'https://api-demo-qclite.quickblox.com/swagger/json',
            route: '/api/',
          },
        ],
        theme: {
          primaryColor: '#3978fc',
        },
      }
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            position: 'left',
            label: 'Developer Docs',
            docId: 'dev/intro',
          },
          {
            position: 'left',
            label: 'Server API',
            to: '/api',
          },
          {
            position: 'left',
            label: 'Blog',
            to: 'https://quickblox.com/blog/quickblox/q-consultation/',
          },
          // {
          //   type: 'docsVersionDropdown', // temporarily disabled, enable again when adding versioning, see https://tutorial.docusaurus.io/docs/tutorial-extras/manage-docs-versions
          //   position: 'right',
          // },
          {
            href: 'https://discord.gg/ZWZ3WpYZ9q',
            position: 'right',
            className: 'header-discord-logo',
            'aria-label': 'Discord',
          },
          {
            href: 'https://github.com/QuickBlox/q-consultation',
            // label: 'GitHub',
            position: 'right',
            className: 'header-github-logo',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {},
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
