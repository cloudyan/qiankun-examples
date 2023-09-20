import { defineConfig } from 'umi';

export default defineConfig({
  locale: false,
  antd: {
    // 暗色主题，版本 4 时才支持
    // dark: true,
    // 紧凑主题在 antd@>4.1.0 时支持
    // compact: true,

    // configProvider 不支持
    // configProvider: {
    //   prefixCls: 'umi3Slave',
    // },
  },
  theme: {
    // '@ant-prefix': 'umi3Slave', // 不生效
    '@primary-color': '#E0282E', // 不约束前缀 prefix，还是会冲突的
    // TODO: 微应用间会相互冲突不？目前测试是会每次切换加载样式，所以没冲突
  },
  hash: true,
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/theme', component: '@/pages/theme' },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: '@/pages/home' },
        { path: '/page1', component: '@/pages/one' },
        { path: '/page2', component: '@/pages/two' },
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
    // type: 'browser',
    type: 'hash',
  },
  // TODO: 这里微应用怎么配置，测试时，这里会干扰 hash 路由
  // 错误 /slave-umi3/#/slave-umi3/page1
  // 正确 /slave-umi3/#/page1
  // umi微应用独立访问需要配置这个参数, 否则默认获取package.name作为base
  // base: '/slave-umi3/',
  base: '/',
});
