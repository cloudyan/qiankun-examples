# FAQ

请详读官方文档：

- [umi 微前端](https://umijs.org/docs/max/micro-frontend)
- [qiankun 官站](https://qiankun.umijs.org/zh)
- [探索微前端的场景极限](https://www.yuque.com/kuitos/gky7yw/uyp6wi)
- [《基于微前端的大型中台项目融合方案》](https://www.yuque.com/zhuanjia/oeisq4/vt6kto)

一些热门问题

- 微前端框架方案对比？
- 主应用和子应用路由该如何设计？
- 主应用和子应用如何通信？
- Modal 弹窗因样式隔离，样式丢失问题？
- 子应用动态注册方案，即运行时注册？
- 子应用间跳转是否兼容？
- 改造微前端后，菜单怎么设计？如何更新？时机？
- 主应用中如何引入子应用？
- 对接微前端后，现有系统哪些能兼容，哪些需要改造？
- 开发调试？

> 不要共享运行时，即便所有的团队都是用同一个框架。
>
> 这算不算是对 MF 的一种否定？

下面是探究过程中遇到的问题和解决方案:

目录

- [FAQ](#faq)
  - [1. 主应用 devtool 中报错](#1-主应用-devtool-中报错)
  - [2. umi 应用配置](#2-umi-应用配置)
  - [3. 主应用是 browser 路由，子应用是 hash 路由的混合模式](#3-主应用是-browser-路由子应用是-hash-路由的混合模式)
  - [4. 子应用之间跳转](#4-子应用之间跳转)
  - [5. 如何部署，涉及到路由方案设计](#5-如何部署涉及到路由方案设计)
    - [场景 1：主应用和微应用部署到同一个服务器（同一个 IP 和端口）](#场景-1主应用和微应用部署到同一个服务器同一个-ip-和端口)
    - [场景 2：主应用和微应用部署在不同的服务器，使用 Nginx 代理访问](#场景-2主应用和微应用部署在不同的服务器使用-nginx-代理访问)
    - [结论及问题分析](#结论及问题分析)
  - [6. 引入子应用方式](#6-引入子应用方式)
  - [7. 运行时的 publicPath 和构建时的 publicPath](#7-运行时的-publicpath-和构建时的-publicpath)
    - [微前端是否会影响现有的服务](#微前端是否会影响现有的服务)
    - [关于 .env.local](#关于-envlocal)
    - [样式隔离](#样式隔离)
    - [如何独立运行微应用？](#如何独立运行微应用)
  - [扩展阅读](#扩展阅读)


## 1. 主应用 devtool 中报错

```jsx
<Router basename="/slave-umi4"> is not able to match the URL "/" because it does not start with the basename, so the <Router> won't render anything.
```

解决办法：子应用使用 hash 路由时不配置 不要配置 `base: 'slave-umi4',`

```js
{
  history: {
    // type: 'browser', // 默认
    type: 'hash',
  },
  // base: 'slave-umi4',
}
```

使用路由模式加载子应用 `slave-umi4` 后，跳转 `purehtml` 子应用，报如下错误

但使用 `<MicroApp />` 组件引入 `slave-umi4`，再跳转 `purehtml` 子应用就没问题

```jsx
<Router basename="/slave-umi4"> is not able to match the URL "/purehtml" because it does not start with the basename, so the <Router> won't render anything.
```

另外，有些浏览器插件也会引起错误日志，如 wiseone

## 2. umi 应用配置

以下是一些常用的配置，默认值如下

```js
{
  base: '/',
  publicPath: '/',
  outputPath: 'dist',
}
```

## 3. 主应用是 browser 路由，子应用是 hash 路由的混合模式

此情况，子应用使用 hash 路由，在主应用中会被变成 browser 路由

暂时没有配置出生效

qiankun 文档有[如下描述](https://qiankun.umijs.org/zh/cookbook#activerule-%E4%BD%BF%E7%94%A8-locationhash-%E5%8C%BA%E5%88%86%E5%BE%AE%E5%BA%94%E7%94%A8)

> activeRule 使用 location.hash 区分微应用

```js
const getActiveRule = (hash) => (location) => location.hash.startsWith(hash);
registerMicroApps([
  {
    name: 'app-hash',
    entry: 'http://localhost:8080',
    container: '#container',
    activeRule: getActiveRule('#/app-hash'),
    // 这里也可以直接写 activeRule: '#/app-hash'，
    // 但是如果主应用是 history 模式或者主应用部署在非根目录，这样写不会生效。
  },
]);
```

参考文档:

- https://qiankun.umijs.org/zh/cookbook
- https://v3.umijs.org/zh-CN/plugins/plugin-qiankun#changelog
  - 不再支持主应用是 browser 路由模式，子应用是 hash 路由的混合模式。如果有场景需要可以通过自己使用 `<MicroApp />` 组件加载子应用。

## 4. 子应用之间跳转

如果子应用通过路由绑定的方式引入，在其它子应用的内部，可以使用 `<MicroAppLink />` 跳转到对应的路由。

```jsx
// 跳转到子应用 app2
<MicroAppLink name="app2" to="/home">go App2</MicroAppLink>

// 跳转到主应用
<MicroAppLink isMaster to="/table">go Master</MicroAppLink>
// 这个组件也是渲染为 a 标签
```

- [微应用之间如何跳转？](https://qiankun.umijs.org/zh/faq#%E5%BE%AE%E5%BA%94%E7%94%A8%E4%B9%8B%E9%97%B4%E5%A6%82%E4%BD%95%E8%B7%B3%E8%BD%AC)

微应用之间的跳转，或者微应用跳主应用页面，直接使用微应用的路由实例是不行的，如 `react-router` 的 `Link` 组件或 `vue` 的 `router-link`，原因是微应用的路由实例跳转都基于路由的 `base`。有这几种办法可以跳转：

1. `history.pushState()`：针对 `history` 路由，如：`history.pushState({}, '', 'url')`
2. 直接使用原生 `a` 标签写完整地址，如：`<a href="http://localhost:8080/app1">app1</a>`
3. `location.href`：针对 hash 路由，如：`window.location.href = 'http://localhost:8080/app1'`

上面的方法 2，3 有些差异

- 路由模式引入子应用，2,3 方法会导致主应用重新加载（刷新）
- `<MicroApp />` 组件模式引入子应用，则可实现主应用无刷新跳转


参考：

- https://umijs.org/docs/max/micro-frontend#%E5%AD%90%E5%BA%94%E7%94%A8%E4%B9%8B%E9%97%B4%E8%B7%B3%E8%BD%AC
- https://qiankun.umijs.org/zh/faq#%E5%BE%AE%E5%BA%94%E7%94%A8%E4%B9%8B%E9%97%B4%E5%A6%82%E4%BD%95%E8%B7%B3%E8%BD%AC

## 5. 如何部署，涉及到路由方案设计

> **建议**：主应用和微应用都是独立开发和部署，即它们都属于不同的仓库和服务。

- 子应用路由都需要注册到主应用

那么部署怎么安排，参看官方文档[如何部署](https://qiankun.umijs.org/zh/cookbook#%E5%A6%82%E4%BD%95%E9%83%A8%E7%BD%B2)

### 场景 1：主应用和微应用部署到同一个服务器（同一个 IP 和端口）

通常的做法是主应用部署在一级目录，微应用部署在二/三级目录。

应用部署在非根目录，需要打包之前做两件事

1. 必须配置 `webpack` 构建时的 `publicPath` 为目录名称
2. `history` 路由的微应用需要设置 `base` ，值为目录名称，用于独立访问时使用。（还需要 Nginx try_files 配合）

部署之后注意三点：

1. `activeRule` 不能和**微应用的真实访问路径一样**，否则在主应用页面刷新会直接变成微应用页面。
2. 微应用的真实访问路径就是微应用的 `entry`，`entry` 可以为相对路径。
3. 微应用的 `entry` 路径最后面的 `/` 不可省略，否则 `publicPath` 会设置错误，例如子项的访问路径是 `http://localhost:8080/app1`,那么 `entry` 就是 `http://localhost:8080/app1/`。

具体的部署有以下两种方式，选择其一即可。

**方案 1**：微应用都放在一个特殊名称（不会和微应用重名）的文件夹下（建议使用）

示例 `/slave/xxxui`

- 通过环境变量判断设置不同的 base `window.__POWERED_BY_QIANKUN__`
- 此时的注册函数是这样的（需要保证 `activeRule` 和 `entry` 不同）

**方案 2**：微应用直接放在二级目录，但是设置特殊的 `activeRule`

示例 `/xxxui`

基本操作和上面是一样的，只要保证 `activeRule` 和微应用的存放路径名不一样即可。

### 场景 2：主应用和微应用部署在不同的服务器，使用 Nginx 代理访问

一般这么做是因为**不允许主应用跨域访问微应用**，做法就是将主应用服务器上一个特殊路径的请求全部转发到微应用的服务器上，即通过代理实现“微应用部署在主应用服务器上”的效果。

### 结论及问题分析

目前现状是：子应用部署在二级目录，已在线提供服务，存在大量采用引用路径

期望：

- 主应用部署根目录
- 子应用继续在二级目录
- 子应用对接为微前端服务后，菜单访问路径保持不变

问题点

1. `activeRule` 不能和微应用的真实访问路径，一定是不能一样的
   1. `entry` 是微应用的真实访问地址，即现已经在线的应用地址（菜单地址）
   2. `activeRule` 是微应用对接微前端的服务访问路径
   3. 微前端要求，需要 `activeRule` 和 `entry` 不同
2. 因 `activeRule` 要不同，所以新的和老的肯定不一样，要做适配或迁移改造
   1. `activeRule` 使用新地址，完成测试，上线后可以变更为旧地址（同时还需要提供真实访问地址）
   2. 初期，这里涉及到批量刷权限配置
   3. 扩展思考：权限跟菜单绑定？路由绑定？是否有更好的设计？
3. 主应用在根目录，影响的不仅仅 UI 应用，还有后端等服务
   1. 什么时候响应为根路径的服务
   2. 可以开白名单指定特点路径（针对已开启微服务的子应用）响应为根目录服务

能否更精简，根据请求特定标识区分真实服务与微服务？

## 6. 引入子应用方式

在父应用中引入子应用，插件提供了三种不同实现的方式：

1. 路由绑定模式引入子应用。
2. `<MicroApp />` 组件引入子应用。
3. `<MicroAppWithMemoHistory />` 组件引入子应用。

```js
registerMicroApps([
  {
    name: 'slave-xxxui',
    entry: '/xxxui/', // http://localhost:8080/xxxui/
    // container: '#container',
    activeRule: '/slave-xxxui',
  },
],
```

## 7. 运行时的 publicPath 和构建时的 publicPath

问题来源：https://qiankun.umijs.org/zh/guide/tutorial#%E5%BE%AE%E5%BA%94%E7%94%A8

新增 `public-path.js` 文件，用于修改运行时的 `publicPath`。[什么是运行时的 publicPath ？](https://webpack.docschina.org/guides/public-path/#on-the-fly)

> 注意：运行时的 publicPath 和构建时的 publicPath 是不同的，两者不能等价替代。

平时我们接触的，在 webpack 中配置，一般都是构建时的 publicPath。这里说的是运行时 publicPath，那有什么用呢？

publicPath 配置项，非常有用，我们通过它来指定应用程序中**所有资源的基础路径**。

一般是在构建时就确定了这个基础路径，比如指定为某个环境变量 `process.env.ASSET_PATH`，但有时，在运行时才能确定这个基础路径，就需要用到运行时修改

> runtime publicPath 主要解决的是微应用动态载入的 脚本、样式、图片 等地址不正确的问题。

1. 什么用处？何时使用？怎么使用？
   1. 用处: 通常用于一套代码在不同环境有不同的 `publicPath` 需要
   2. 适用: `publicPath` 由服务器通过 HTML 的 `window.publicPath` 全局变量输出。
2. 怎么修改？
   1. 参看下文

webpack 暴露了一个名为 `__webpack_public_path__` 的全局变量。所以在应用程序的 entry point 中，可以直接如下设置：

```js
// ASSET_PATH 资源路径环境变量
__webpack_public_path__ = process.env.ASSET_PATH;
```

> 注意，如果在 entry 文件中使用 ES2015 module import，则会在 import 之后进行 `__webpack_public_path__` 赋值。在这种情况下，你必须将 public path 赋值移至一个专用模块中，然后将它的 import 语句放置到 entry.js 最上面：

```js
// entry.js/main.js
// umi 中为 app.js
import './public-path';
import './app';
```

当在 webpack 配置中设置了 output.publicPath 选项时，webpack 会在构建输出包的代码中自动注入 `__webpack_public_path__` 变量，并将其值设置为 output.publicPath 的配置值。

怎么运行时动态修改呢？将其赋值为一个 window 变量，就可以动态修改了。

qiankun 中会如下注入内容

```js
// public-path.js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

qiankun 将会在微应用 bootstrap 之前注入一个运行时的 publicPath 变量，你需要做的是在微应用的 entry js 的顶部添加如下代码

```js
__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
```

有可能你事先不知道 publicPath 是什么，webpack 会自动根据 `import.meta.url`、`document.currentScript`、`script.src` 或者 `self.location` 变量设置 publicPath。你需要做的是将 `output.publicPath` 设为 `'auto'`：

```js
module.exports = {
  output: {
    publicPath: 'auto',
  },
};
```

### 微前端是否会影响现有的服务

1. 灰度发布方案，不受影响（需要确保 cookie 透传）

### 关于 .env.local

解释

```bash
.env                # 默认，所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式/环境下加载，如 development, test, production
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```

以下是开发构建和生产构建的文件的优先级：

- 开发：(npm start): `.env.development.local`, `.env.local`, `.env.development`, `.env`
- 产品：(npm run build): `.env.production.local`, `.env.local`, `.env.production`, `.env`

如果您想在本地环境中使用某些内容而不特定于开发构建或生产构建，则可以向文件中添加一些变量 `.env.local`。

来源：https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used

一般情况，框架（vue, react, umi）使用环境变量，底层都是使用的 `dotenv` 这个包

根据需要，我们为了本地开发环境，用于分配不同的微服务端口，也需要提交入库，所以使用 `.env`

### 样式隔离

我们对多个微应用需要控制样式隔离，这里我们通过定制主题查看不同微应用的样式

不同项目配置不同，以下为参考

隔离样式，配置如下

```js
export const qiankun = {
  // 注册子应用
  apps: [
    {
      name: 'slave-umi3',
      entry: '//localhost:6002',
      activeRule: '/slave-umi3',
      props: {
        autoCaptureError: true,
      },
      container: '#slave-umi3',
      // 隔离样式 experimentalStyleIsolation
      sandbox: {
        experimentalStyleIsolation: true,
      },
    },
  ],
}
```

修改主题如下：

umi4 + antd4

```js
// umi4 + antd4
{
  antd: {
    configProvider: {
      prefixCls: 'umi4Slave',
    },
  },
  lessLoader: {
    modifyVars: {
      '@ant-prefix': 'umi4Slave',
      '@primary-color': '#5A54F9',
    },
    javascriptEnabled: true,
  },
}
```

umi3 + antd4

```js
{
  // umi3 + antd4
  antd: {},
  theme: {
    '@primary-color': '#ea1244'
  },
}
```

上述配置隔离不彻底，需要参考 [如何确保主应用跟微应用之间的样式隔离](https://qiankun.umijs.org/zh/faq#%E5%A6%82%E4%BD%95%E7%A1%AE%E4%BF%9D%E4%B8%BB%E5%BA%94%E7%94%A8%E8%B7%9F%E5%BE%AE%E5%BA%94%E7%94%A8%E4%B9%8B%E9%97%B4%E7%9A%84%E6%A0%B7%E5%BC%8F%E9%9A%94%E7%A6%BB)

```js
// 配置 webpack 修改 less 变量
{
  loader: 'less-loader',
+ options: {
+   modifyVars: {
+     '@ant-prefix': 'yourPrefix',
+   },
+   javascriptEnabled: true,
+ },
}

// 配置 antd ConfigProvider
import { ConfigProvider } from 'antd';

export const MyApp = () => (
  <ConfigProvider prefixCls="yourPrefix">
    <App />
  </ConfigProvider>
);
```

umi4 + antd5

```jsx
{
  // umi4 + antd5
  antd: {
    // valid for antd5.0 only
    theme: {
      token: {
        colorPrimary: "#82b2f4", // 此种配置优先级不高，可能会被不规范的主题覆盖
      },
    },
    /**
     * antd@5.1.0 ~ 5.2.3 仅支持 appConfig: {}, 来启用 <App /> 组件;
     * antd@5.3.0 及以上才支持 appConfig: { // ... } 来添加更多 App 配置项;
     * 项目中 Modal 组件要改为使用 App.modal.success({})
     */
    appConfig: {
      message: {
        maxCount: 3,
      },
    },
  },
}

// 使用示例
import { App, Button } from 'antd';
import { useModel } from '@umijs/max';

const App = () => {
  const { name } = useModel('global');
  const { message, modal } = App.useApp();

  const showModal = () => {
    // 这里不使用 Modal, 使用 modal
    modal.warning({
      title: '标题',
      content: '欢迎使用',
    });
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>打开弹窗</Button>
    </>
  )
}
```

### 如何独立运行微应用？

有些时候我们希望直接启动微应用从而更方便的开发调试，你可以使用这个全局变量来区分当前是否运行在 qiankun 的主应用的上下文中：

```js
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export const mount = async () => render();
```

参考

- [umi4 怎么实现动态切换主题](https://github.com/umijs/umi/discussions/11142)
  - 这里 [umi-plugin-antd-style](https://github.com/xiaohuoni/umi-plugin-antd-style)，有个在线 [demo](https://codesandbox.io/p/github/xiaohuoni/plugin-antd-style-demo/main?file=/config/config.ts)
- [Ant Design Style](https://ant-design.github.io/antd-style/)
- [Dumi Theme](https://dumi-theme-antd-style.arvinx.app/)

## 扩展阅读

- 全局 modal 弹窗样式隔离问题
  - [样式隔离](https://github.com/umijs/qiankun/issues/1316)
  - [解决微前端 qiankun 中子应用弹窗样式丢失的问题](https://juejin.cn/post/7102698184496906247)
