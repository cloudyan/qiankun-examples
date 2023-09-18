import { notification } from 'antd';
import React, {useState} from 'react';
import { isAppActive } from './helper'
import './app.css'
// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

const callback = (data: { name: string, message: string }) => {
  notification.open({
    type: 'info',
    message: `来自${data.name}的Reply`,
    description: data.message,
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
}

export const layout = () => {

  const [openKeys, setOpenKeys] = useState<string[]>([])

  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    menuProps: {
      openKeys,
    },
    onOpenChange: setOpenKeys,
    rightContentRender: false,
    token: {
      sider: {
        menuBackgroundColor: '#004FD9',
        menuTextColor: 'rgba(255,255,255,0.85)',
        subMenuSelectedTextColor: '#fff',
        menuTextColorSecondary: 'rgba(255,255,255,0.65)',
        menuSelectedTextColor: '#fff',
        menuTitleTextColor: 'rgba(255,255,255,0.95)',
        menuItemHoverBgColor: 'rgba(0,0,0,0.06)',
        menuItemCollapsedHoverBgColor: 'rgba(0,0,0,0.06)',
        menuItemSelectedBgColor: 'rgba(0,0,0,0.15)',
        menuItemCollapsedSelectedBgColor: 'rgba(0,0,0,0.15)',
        menuItemDividerColor: 'rgba(255,255,255,0.15)',
        collapsedButtonBgColor: '#fff',
        collapsedButtonTextColor: 'rgba(0,0,0,0.45)',
        collapsedButtonHoverTextColor: 'rgba(0,0,0,0.65)',
        menuSubArrowColor: 'rgba(255,255,255,0.15)',
      },
      appListIconTextColor: 'rgba(255,255,255,0.85)',
      appListIconHoverTextColor: 'rgba(255,255,255,0.95)',
      appListIconHoverBgColor: 'rgba(0,0,0,0.06)',
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
  // 注册子应用
  apps: [
    {
      name: 'slave-umi4',
      entry: '//localhost:6001', // your slave app address
      activeRule: '/slave-umi4',
      container: '#slave-umi4',
      credentials: true, // 影响 js 跨域资源加载了
      sandbox: {
        strictStyleIsolation: true,
        experimentalStyleIsolation: true
      },
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
    {
      name: 'slave-umi3',
      entry: '//localhost:6002',
      activeRule: '/slave-umi3',
      // credentials: true, // umi3 中这个配置影响 js 跨域资源加载了
      props: {
        autoCaptureError: true,
      },
      container: '#slave-umi3',
      sandbox: {
        strictStyleIsolation: true,
        experimentalStyleIsolation: true
      },
    },
    {
      name: 'sub-app-1',
      entry: '//localhost:5001',
      activeRule: '/sub-app-1',
      container: '#micro-app-1',
      credentials: true,
      sandbox: {
        strictStyleIsolation: true,
        experimentalStyleIsolation: true
      },
      props: {
        autoCaptureError: true,
        base: '/sub-app-1',
        defaultProps: {
          slogan: 'Hello MicroFrontend from qiankun-apps-props',
          callback,
        }
      },
    },
    {
      name: 'sub-app-2',
      entry: '//localhost:5002',
      activeRule: '/sub-app-2',
      container: '#micro-app-2',
      credentials: true,
      sandbox: {
        experimentalStyleIsolation: true
      },
    },
    {
      name: 'sub-app-3',
      entry: '//localhost:5003',
      activeRule: '/sub-app-3',
      container: '#micro-app-3',
      credentials: true,
      sandbox: {
        experimentalStyleIsolation: true
      },
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

