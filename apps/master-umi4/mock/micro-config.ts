
interface Apps {
  name: string;
  entry: string;
  container: string;
  activeRule: string;
  props?: any;
  sandbox?: any;
}

// 动态注册子应用
let localApps: Apps[] = [
  {
    name: 'slave-umi4',
    entry: '//localhost:6001', // your slave app address
    container: '#MacroAppRoot',
    activeRule: '/slave-umi4',
    // activeRule: '/slave-umi4',
    // container: '#slave-umi4',
    // credentials: true, // 影响 js 跨域资源加载了
    sandbox: {
      strictStyleIsolation: true,
      // experimentalStyleIsolation: true
    },
    props: {
      autoCaptureError: true,
    },
  },
  {
    name: 'slave-umi3',
    entry: '//localhost:6002',
    container: '#MacroAppRoot',
    activeRule: '/slave-umi3',
    // credentials: true, // umi3 中这个配置影响 js 跨域资源加载了
    sandbox: {
      strictStyleIsolation: true,
      // experimentalStyleIsolation: true
    },
    props: {
      autoCaptureError: true,
    },
  },
];

// 动态注册路由，此方式主应用 history 路由会影响子应用 hash 路由
// 这里内部使用 loadMicroApp 加载的子应用
const routes = [
  {
    name: 'slave-umi4',
    // 带上 * 通配符意味着将其下所有子路由都关联给微应用
    path: '/slave-umi4/*',
    microApp: 'slave-umi4',
    microAppProps: {
      autoCaptureError: true,
    },
  },
  {
    name: 'slave-umi3',
    // 带上 * 通配符意味着将其下所有子路由都关联给微应用
    path: '/slave-umi3/*',
    microApp: 'slave-umi3',
    microAppProps: {
      autoCaptureError: true,
    },
  },
];

export default {
  'GET /api/micro-config': {
    apps: localApps,
    routes,
  },
};
