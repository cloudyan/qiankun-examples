# FAQ

请详读官方文档：

- [umi 微前端](https://umijs.org/docs/max/micro-frontend)
- [qiankun 官站](https://qiankun.umijs.org/zh)
- [探索微前端的场景极限](https://www.yuque.com/kuitos/gky7yw/uyp6wi)
- [《基于微前端的大型中台项目融合方案》](https://www.yuque.com/zhuanjia/oeisq4/vt6kto)

目录

- [FAQ](#faq)
  - [1. 主应用 devtool 中报错](#1-主应用-devtool-中报错)
  - [2. umi 应用配置](#2-umi-应用配置)
  - [3. 主应用是 browser 路由，子应用是 hash 路由的混合模式](#3-主应用是-browser-路由子应用是-hash-路由的混合模式)
  - [4. 子应用之间跳转](#4-子应用之间跳转)
  - [5. 如何部署](#5-如何部署)
    - [场景 1：主应用和微应用部署到同一个服务器（同一个 IP 和端口）](#场景-1主应用和微应用部署到同一个服务器同一个-ip-和端口)
    - [场景 2：主应用和微应用部署在不同的服务器，使用 Nginx 代理访问](#场景-2主应用和微应用部署在不同的服务器使用-nginx-代理访问)
    - [问题分析](#问题分析)
  - [6. 引入子应用](#6-引入子应用)
  - [7. 运行时的 publicPath 和构建时的 publicPath](#7-运行时的-publicpath-和构建时的-publicpath)


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
<MicroAppLink isMaster to="/table">
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

## 5. 如何部署

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

### 问题分析

目前已经将子应用部署在二级目录，并提供服务，存在大量采用引用路径

期望，主应用部署根目录，子应用继续在二级目录，但转为微前端后，菜单访问路径保持不变

注意点

1. `activeRule` 不能和微应用的真实访问路径，一定是不能一样的
   1. 需要保证 `activeRule` 和 `entry` 不同
   2. 否则主应用页面刷新就变成微应用
2. 菜单路径肯定要变，导致菜单要变，想不变，就要共存
   1. 要先有测试地址，activeRule 适用新地址，测试完成，可以与真实地址交换
   2. 这里涉及到批量刷权限配置
   3. 思考：权限跟菜单绑定？路由绑定？是否有更好的设计？
3. 主应用在根目录，影响的不仅仅 UI 应用，还有后端等服务
   1. 可以开白名单指定特点路径转发到根目录（开启微服务的子应用），响应主应用服务

能否更精简，根据请求特定标识区分真实服务与微服务？

## 6. 引入子应用

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

新增 `public-path.js` 文件，用于修改运行时的 `publicPath`。[什么是运行时的 publicPath ？](https://webpack.docschina.org/guides/public-path/#on-the-fly)

> 注意：运行时的 publicPath 和构建时的 publicPath 是不同的，两者不能等价替代。

平时我们接触的一般都是构建时的 publicPath, 在 webpack 中配置

webpack 暴露了一个名为 `__webpack_public_path__` 的全局变量。所以在应用程序的 entry point 中，可以直接如下设置：

```js
__webpack_public_path__ = process.env.ASSET_PATH;
```

> 注意，如果在 entry 文件中使用 ES2015 module import，则会在 import 之后进行 `__webpack_public_path__` 赋值。在这种情况下，你必须将 public path 赋值移至一个专用模块中，然后将它的 import 语句放置到 entry.js 最上面：

```js
// entry.js/main.js
import './public-path';
import './app';
```

```js
// public-path.js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

