import { defineConfig } from '@umijs/max';
import routes from './config/routes'

export default defineConfig({
  antd: {
    configProvider: {
      prefixCls: 'master-antd',
    }
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  lessLoader: {
    modifyVars: {
      '@ant-prefix': 'master-antd',
      'primary-color': '#004FD9',
    },
    javascriptEnabled: true,
  },
  routes,
  qiankun: {
    master: {
      prefetch: false,
    },
  },
  npmClient: 'pnpm',
  // mfsu: false,
});

