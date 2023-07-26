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
  // 默认使用 @ant-design/pro-layout，一般会自定义
  // https://procomponents.ant.design/components/layout#prolayout
  layout: {
    title: 'qiankun',
    locale: false,
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
      // 这里不写，可在 app.ts 中使用运行时注册
      // apps: [],
    },
    slave: {},
  },
  base: '/',
  npmClient: 'pnpm',
  mfsu: false,
});

