export default [
  {
    path: '/',
    component: '@/layouts/index.tsx',
    layout: false,
    routes: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        name: '首页',
        path: '/home',
        component: './Home',
      },

      // {
      //   name: '权限演示',
      //   path: '/access',
      //   component: './Access',
      // },
      // {
      //   name: 'CRUD 示例',
      //   path: '/table',
      //   component: './Table',
      // },
      // {
      //   name: '主题',
      //   path: '/theme',
      //   component: './Theme',
      // },

      // 路由
      // {
      //   path: '/slave-umi4/*',
      //   component: './app',
      // },


      // 微应用
      // {
      //   path: '/slave-umi4/*',
      //   microApp: 'slave-umi4',
      //   microAppProps: {
      //     autoSetLoading: true,
      //     autoCaptureError: true,
      //   },
      // },
      // {
      //   path: '/slave-umi3/*',
      //   microApp: 'slave-umi3',
      //   microAppProps: {
      //     autoSetLoading: true,
      //     autoCaptureError: true,
      //   },
      // },

      // 子应用自适配路由
      // {
      //   path: '/*',
      //   layout: false,
      //   component: './app',
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

      // 配置模式引入子应用 <MicroApp name="app1" autoCaptureError />
      // loadMicroApp 动态手动加载子应用
      // {
      //   name: 'purehtml',
      //   path: '/purehtml',
      //   // microApp: 'purehtml', // 不能写，没注册这个微应用
      //   component: './load-purehtml',
      // },

      // {
      //   path: '/slave-xxx/*',
      //   microApp: 'slave-xxx',
      // },
      // 路由模式引入子应用，也可以使用运行时配置
      // {
      //   name: 'load-umi4(MicroApp)',
      //   path: '/load-umi4/',
      //   component: './load-umi4',
      // },
      // {
      //   name: 'load-umi4(page1)',
      //   path: '/load-umi4/#/page1?xxx=123',
      // },
      // {
      //   name: 'slave-umi4(路由)',
      //   // 带上 * 通配符意味着将其下所有子路由都关联给微应用
      //   path: '/slave-umi4/*',
      //   microApp: 'slave-umi4',
      //   microAppProps: {
      //     autoSetLoading: true,
      //     autoCaptureError: true,
      //   },
      // },

      // {
      //   name: '组合页面 umi3,umi4',
      //   path: '/two-micro-app/*',
      //   component: './load-umi',
      // },
      // {
      //   name: 'sub-app-2(react)',
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
      //   name: 'sub-app-1(umi3)',
      //   path: '/sub-app-1',
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
      //   ],
      // },
      {
        path: '/*',
        component: './Exception404',
      },
    ]
  },
  {
    path: '/404',
    component: './Exception404',
  },

]
