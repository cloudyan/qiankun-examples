import { defineConfig } from '@umijs/max';

export default defineConfig({
  model: {},
  qiankun: {
    slave: {},
  },
  history: {
    type: 'browser',
    // type: 'hash',
  },
  // base: '/slave-umi4/',
  hash: true,
  antd: {
    configProvider: {
      prefixCls: 'umi4Slave',
    },
  },
  lessLoader: {
    modifyVars: {
      '@ant-prefix': 'umi4Slave',
      'primary-color': '#5A54F9',
    },
    javascriptEnabled: true,
  },
  routes: [
    // 精简配置
    // { path: '/home', component: 'index' },
    // { path: '/page1', component: 'page1' },
    { path: '/theme', layout: false, component: '@/pages/theme' },
    {
      path: '/',
      component: '@/layouts',
      layout: false,
      routes: [
        { path: '/home', component: '@/pages/index' },
        { path: '/page1', component: '@/pages/page1' },
        { path: '/page2', component: '@/pages/page2' },
        { path: '/', redirect: '/home' },
        { path: '/*', component: '@/pages/404' },
      ],
    },
  ],
  npmClient: 'pnpm',
});
