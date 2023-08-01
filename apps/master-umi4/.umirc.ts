import { defineConfig } from '@umijs/max';
import routes from './config/routes'

export default defineConfig({
  antd: {
    // valid for antd5.0 only
    theme: {
      token: {
        colorPrimary: "#82b2f4",
      },
    },
    /**
     * antd@5.1.0 ~ 5.2.3 仅支持 appConfig: {}, 来启用 <App /> 组件;
     * antd@5.3.0 及以上才支持 appConfig: { // ... } 来添加更多 App 配置项;
     */
    appConfig: {
      message: {
        maxCount: 3,
      },
    },
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  // 默认使用 @ant-design/pro-layout，一般会自定义
  // https://procomponents.ant.design/components/layout#prolayout
  layout: {
    title: 'qiankun',
    locale: false,
  },
  // lessLoader: {
  //   modifyVars: {
  //     '@ant-prefix': 'umi4Master',
  //     'primary-color': '#408df8',
  //   },
  //   javascriptEnabled: true,
  // },
  routes,
  qiankun: {
    master: {
      prefetch: true,
      sandbox: true,
      // 这里不写，可在 app.ts 中使用运行时注册
      // apps: [],
    },
    slave: {},
  },
  base: '/',
  npmClient: 'pnpm',
  mfsu: false,
});

