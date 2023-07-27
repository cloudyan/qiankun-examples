export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '首页',
    path: '/home',
    component: './Home',
  },
  {
    name: '权限演示',
    path: '/access',
    component: './Access',
  },
  // {
  //   name: 'CRUD 示例',
  //   path: '/table',
  //   component: './Table',
  // },
  {
    name: '主题',
    path: '/theme',
    component: './Theme',
  },
  {
    name: 'Umi4',
    path: '/umi4/',
    component: './load-umi4',
  },
  // {
  //   name: 'Umi3',
  //   path: '/umi3',
  //   component: './Home',
  // },
  // {
  //   name: 'Webpack',
  //   path: '/webpack',
  //   component: './Home',
  // },
  // {
  //   name: 'MF-host',
  //   path: '/mf-host',
  //   component: './Home',
  // },
  // vue2
  // vue3
  // React17
  // React16
  // React15

  // {
  //   path: '/slave-xxx/*',
  //   microApp: 'slave-xxx',
  // },
  // 路由模式引入子应用，也可以使用运行时配置
  {
    name: 'slave-umi4',
    // 带上 * 通配符意味着将其下所有子路由都关联给微应用
    path: '/slave-umi4/*',
    microApp: 'slave-umi4',
    microAppProps: {
      autoSetLoading: true,
      autoCaptureError: true,
    },
  },
  // 配置模式引入子应用 <MicroApp name="app1" autoCaptureError />
  // loadMicroApp 动态手动加载子应用
  {
    name: 'purehtml',
    path: '/purehtml',
    // microApp: 'purehtml', // 不能写，没注册这个微应用
    component: './load-purehtml',
  },
  // {
  //   name: 'react-micro-app',
  //   path: '/sub-app-2',
  //   component: './load',
  // },

  // {
  //   name: 'react-router-micro-app',
  //   path: '/sub-app-3',
  //   microApp: 'sub-app-3',
  //   routes: [
  //     {
  //       name: '嵌套路由1',
  //       path: '/sub-app-3/one',
  //     },
  //     {
  //       name: '嵌套路由2',
  //       path: '/sub-app-3/three',
  //     },
  //     {
  //       path: '/sub-app-3',
  //       redirect: '/sub-app-3/one',
  //     },
  //   ],
  // },

  // {
  //   name: 'umi3-micro-app',
  //   path: '/sub-app-1',
  //   layout: true,
  //   microApp: 'sub-app-1',
  //   routes: [
  //     {
  //       name: '应用间通信',
  //       path: '/sub-app-1/one',
  //     },
  //     {
  //       name: '应用间嵌套',
  //       path: '/sub-app-1/two',
  //     },
  //     {
  //       name: '应用间通信',
  //       path: '/sub-app-1/sub-app-3',
  //       routes: [
  //         {
  //           name: '嵌套路由1',
  //           path: '/sub-app-1/sub-app-3/one',
  //         },
  //         {
  //           name: '嵌套路由2',
  //           path: '/sub-app-1/sub-app-3/three',
  //         },
  //       ],
  //     },
  //   ],
  // },

  {
    path: '/404',
    component: './Exception404',
  },
]
