import { notification } from 'antd';
import React, {useState} from 'react';
import { isAppActive } from './helper'
// import { CustomLink } from '@/components/CustomLink'
import { RunTimeLayoutConfig } from '@umijs/max'
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

// const CustomHeader = () => {
//   return (
//     <>
//       <a href="/custom-link">Custom Link</a>
//       <a href="/load-umi4/#/page1">umi4 page1</a>
//     </>
//   );
// };

export const layout: RunTimeLayoutConfig = (initialState) => {

  const [openKeys, setOpenKeys] = useState<string[]>([])

  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    menuProps: {
      openKeys,
    },
    // actionsRender: () => [<CustomLink link="/slave-umi4/#page1" />, <CustomLink link="/slave-umi4/#page2" />],
    // headerRender: CustomHeader,
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
export const qiankun = fetch('/api/micro-config')
  .then((res) => {
    return res.json();
  })
  .then(({ apps }) => {
    window.__microApps__ = apps;
    return Promise.resolve({
      // 注册子应用信息
      apps,
      // 完整生命周期钩子请看 https://qiankun.umijs.org/zh/api/#registermicroapps-apps-lifecycles
      lifeCycles: {
        afterMount: (props) => {
          console.log(props);
        },
      },
      // 支持更多的其他配置，详细看这里 https://qiankun.umijs.org/zh/api/#start-opts
    });
  });
