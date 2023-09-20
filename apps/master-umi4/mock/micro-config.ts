
interface Apps {
  name: string;
  entry: string;
  container: string;
  activeRule: string;
  props?: any;
  sandbox?: any;
}

// 注册子应用
let localApps: Apps[] = [
  {
    name: 'slave-umi4',
    entry: '//localhost:6001', // your slave app address
    container: '#MacroAppRoot',
    activeRule: '/slave-umi4',
    // activeRule: '/slave-umi4',
    // container: '#slave-umi4',
    // credentials: true, // 影响 js 跨域资源加载了
    // sandbox: {
    //   strictStyleIsolation: true,
    //   experimentalStyleIsolation: true
    // },
  },
  {
    name: 'slave-umi3',
    entry: '//localhost:6002',
    container: '#MacroAppRoot',
    activeRule: '/slave-umi3',
    // credentials: true, // umi3 中这个配置影响 js 跨域资源加载了
    // sandbox: {
    //   strictStyleIsolation: true,
    //   experimentalStyleIsolation: true
    // },
    props: {
      autoCaptureError: true,
    },
  },
]

export default {
  'GET /api/micro-config': {
    apps: localApps,
  },
};
