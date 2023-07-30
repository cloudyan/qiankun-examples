import { defineConfig } from '@umijs/max';

export default defineConfig({
  model: {},
  qiankun: {
    slave: {},
  },
  history: {
    // type: 'browser', // 默认
    type: 'hash',
  },
  // base: 'slave-umi4',
  hash: true,
  lessLoader: {
    modifyVars: {
      '@ant-prefix': 'mainAnt',
      'primary-color': '#1DA57A',
    },
    javascriptEnabled: true,
  },
  routes: [
    // 精简配置
    // { path: '/home', component: 'index' },
    // { path: '/page1', component: 'page1' },
    {
      path: '/',
      component: '@/layouts',
      layout: false,
      routes: [
        { path: '/theme', layout: false, component: '@/pages/theme' },
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
