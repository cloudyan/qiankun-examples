import { defineConfig } from 'umi';

export default defineConfig({
  antd: {},
  locale: false,
  theme: {
    '@primary-color': '#ea1244'
  },
  hash: true,
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/theme',
      name: 'theme',
      component: '@/pages/theme',
    },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        {
          path: '/',
          redirect: '/home'
        },
        {
          path: '/home',
          name: 'home',
          component: '@/pages/home',
        },
        {
          path: '/page1',
          name: 'page1',
          component: '@/pages/one',
        },
        {
          path: '/page2',
          name: 'page2',
          component: '@/pages/two',
        },
        // {
        //   name: 'micro-3',
        //   path: '/sub-app-3',
        //   microApp: 'sub-app-3',
        // },
      ]
    },

  ],
  fastRefresh: {},
  mfsu: false,
  qiankun: {
    slave: {},  // 微应用必须配置
  },
  mountElementId: 'micro-app-1',  //  容器ID
  // runtimeHistory: {}, // 开始运行时history功能
  history: {
    type: 'hash'
  },
  base: '/',  //  umi微应用独立访问需要配置这个参数, 否则默认获取package.name作为base
});
