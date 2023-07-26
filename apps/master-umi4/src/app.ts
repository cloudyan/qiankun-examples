import { isAppActive } from './helper'
// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
  };
};

const getActiveRule = (hash: string) => {
  // console.log('getActiveRule', appPath);
  return (location) => {
    // console.log(location.pathname.startsWith(appPath))
    // return location.pathname.startsWith(appPath)
    console.log('hash', location.hash)
    return location.hash.startsWith(hash);
  }
}

// 动态路由
export const qiankun = {
  apps: [
    {
      name: 'slave-umi4',
      entry: 'http://127.0.0.1:5001', // your slave app address
      // activeRule: 'slave-umi4',
      // activeRule: getActiveRule('#/slave-umi4'),
      // activeRule: (location) => {
      //   debugger;
      //   console.log('location', location)
      //   const history = 'hash'
      //   const base = ''; // 'slave-umi4'
      //   let matchedBase = 'slave-umi4'; // base
      //   return isAppActive(location, history, {
      //     base,
      //     setMatchedBase: (v: string) => (matchedBase = v),
      //   });
      // },
      // props: {
      //   history: {type: 'hash'}, // 子应用使用 hash 路由模式（未生效）
      // },
    },
  ],
  // 路由模式引入子应用
  // 运行时配置微应用路由，会附加到跟路由下（顺序怎么控制）
  // 解释: 注册的路由路由，和渲染的菜单顺序，一般是不一致的，所以可以不控制顺序
  // routes: [
  //   {
  //     name: 'slave-umi4',
  //     // 带上 * 通配符意味着将其下所有子路由都关联给微应用
  //     path: '/slave-umi4/*',
  //     microApp: 'slave-umi4',
  //     microAppProps: {
  //       autoCaptureError: true,
  //     },
  //   },
  // ],
};

