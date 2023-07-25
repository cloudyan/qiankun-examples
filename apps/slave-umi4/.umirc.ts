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
  // <Router basename="/slave-umi4"> is not able to match the URL "/" because it does not start with the basename, so the <Router> won't render anything.
  // 解决办法：使用 hash 路由时不配置
  // base: 'slave-umi4',
  // base, publicPath, outputPath 默认值分别为 '/', '/', 'dist'
  hash: true,
  routes: [
    // 默认精简配置
    // { path: '/home', component: 'index' },
    // { path: '/page1', component: 'page1' },

    // 完整配置
    {
      path: '/',
      component: '@/layouts',
      layout: false,
      routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: '@/pages/index' },
        { path: '/page1', component: '@/pages/page1' },
        { path: '/page2', component: '@/pages/page2' },
      ],
    }
  ],
  npmClient: 'pnpm',
});
