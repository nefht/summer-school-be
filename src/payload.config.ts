// @ts-check

import path from 'path';

import { payloadCloud } from '@payloadcms/plugin-cloud';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { slateEditor } from '@payloadcms/richtext-slate';
import { buildConfig } from 'payload/config';

import Users from './collections/Users';
import Posts from './collections/Posts';
import Media from './collections/Media';
import Registrations from './collections/Registrations';
import Course from './collections/Course';
import AboutUs from './collections/AboutUs';

import Dashboard from './views/Dashboard';

import Logo from './graphics/Logo.jsx';
import Icon from './graphics/Icon.jsx';
import Nav from './components/nav/Nav';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_EXTERNAL_SERVER_URL,
  // serverURL: process.env.HOST_PUBLIC_EXTERNAL_SERVER_URL,

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Summer School',
      // favicon: './assets/logo.png',
      ogImage: './assets/logo.svg',
    },
    bundler: webpackBundler(),
    webpack: (config) => ({
      ...config,
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\tailwind.css$/i,
            use: ['css-loader', 'postcss-loader'],
          },
        ],
      },
      resolve: {
        ...config.resolve,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
          ...config.resolve.alias,
        },
      },
    }),
    css: path.resolve(__dirname, 'custom-styles.css'),
    components: {
      Nav: Nav,
      views: {
        Dashboard: Dashboard,
      },
      graphics: {
        Logo,
        Icon,
      },
    },
  },

  cors: process.env.WHITELIST_ORIGINS
    ? process.env.WHITELIST_ORIGINS.split(',')
    : [],

  csrf: process.env.WHITELIST_ORIGINS
    ? process.env.WHITELIST_ORIGINS.split(',')
    : [],

  editor: slateEditor({}),

  collections: [Users, Posts, Media, Registrations, Course, AboutUs],

  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },

  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },

  plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
});
