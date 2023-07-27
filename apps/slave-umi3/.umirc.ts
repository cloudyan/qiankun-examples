import { defineConfig } from 'umi';

export default defineConfig({
  antd: false,
  locale: false,
  theme: {
    'primary-color': '#ea1244'
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
          path: '/one',
          name: 'one',
          component: '@/pages/one',
        },
        {
          path: '/two',
          name: 'two',
          component: '@/pages/two',
        },
        // {
        //   name: 'micro-3',
        //   path: '/sub-app-3',
        //   microApp: 'sub-app-3',
        // },
        {
          path: '/',
          redirect: '/one'
        },
      ]
    },

  ],
  fastRefresh: {},
  mfsu: false,
  // runtimeHistory: {}, // 开始运行时history功能
  base: '/',  //  umi微应用独立访问需要配置这个参数, 否则默认获取package.name作为base
});
