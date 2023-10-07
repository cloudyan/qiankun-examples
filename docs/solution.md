# 方案

- [方案](#方案)
  - [思路](#思路)
  - [实现方式](#实现方式)
  - [框架](#框架)
    - [single-spa: 最早的前端微服务 Javascript 框架，兼容多种前端技术栈](#single-spa-最早的前端微服务-javascript-框架兼容多种前端技术栈)
    - [qiankun](#qiankun)
    - [Module Federation：是 Zack Jackson 发明的 JavaScript 架构，Zack Jackson 随后提出为其创建一个 Webpack 插件。](#module-federation是-zack-jackson-发明的-javascript-架构zack-jackson-随后提出为其创建一个-webpack-插件)
    - [Bit：将独立的组件构建、集成和组合到一起和管理前端](#bit将独立的组件构建集成和组合到一起和管理前端)
    - [MicroApp：是京东零售推出的基于类WebComponent进行渲染，从组件化的思维实现的微前端技术](#microapp是京东零售推出的基于类webcomponent进行渲染从组件化的思维实现的微前端技术)
    - [无界：腾讯推出的基于 Web Components + iframe 微前端框架，具备成本低、速度快、原生隔离、功能强等一系列优点](#无界腾讯推出的基于-web-components--iframe-微前端框架具备成本低速度快原生隔离功能强等一系列优点)
    - [EMP](#emp)
  - [选择考量](#选择考量)
  - [如何选择](#如何选择)


## 思路

- 基于接口协议：子应用按照协议导出几个接口，主应用在运行过程中调用子应用导出的这几个接口
- 基于沙箱隔离：主应用创建一个隔离环境，让子应用基本不用考虑自己是在什么环境下运营，按照普通的开发思路进行开发即可
- 基于模块协议：主应用把子应用当作一个模块，和模块的使用方式无异

## 实现方式

- 路由分发
- iframe
- 应用微服务化
- 微件化
- 微应用化
- 纯 Web Components
- 结合 Web Components

## 框架



### single-spa: 最早的前端微服务 Javascript 框架，兼容多种前端技术栈

是一个将多个单页面应用聚合为一个整体应用的 JavaScript 微前端框架，
在同一页面上使用多个前端框架，而不用刷新页面，
不限技术栈，
支持独立部署每一个单页面应用，
新功能使用新框架，旧的单页应用不用重写可以共存，
有效改善初始加载时间，延迟加载代码，
文档：https://github.com/single-spa/single-spa

### qiankun

📦 基于 [single-spa](https://github.com/CanopyTax/single-spa) 封装，提供了更加开箱即用的 API。
📱 技术栈无关，任意技术栈的应用均可 使用/接入，不论是 React/Vue/Angular/JQuery 还是其他等框架。
💪 HTML Entry 接入方式，让你接入微应用像使用 iframe 一样简单。
🛡​ 样式隔离，确保微应用之间样式互相不干扰。
🧳 JS 沙箱，确保微应用之间 全局变量/事件 不冲突。
⚡️ 资源预加载，在浏览器空闲时间预加载未打开的微应用资源，加速微应用打开速度。
🔌 umi 插件，提供了 @umijs/plugin-qiankun 供 umi 应用一键切换成微前端架构系统。

文档: https://qiankun.umijs.org/zh/guide

### Module Federation：是 Zack Jackson 发明的 JavaScript 架构，Zack Jackson 随后提出为其创建一个 Webpack 插件。

是webpack给出的微前端方案，
使 JavaScript 应用可以动态运行另一个 JavaScript 应用中的代码，同时可以共享依赖，
依赖自动管理，可以共享 Host 中的依赖，版本不满足要求时自动 fallback 到 Remote 中依赖，
共享模块粒度自由掌控，小到一个单独组件，大到一个完整应用。既实现了组件级别的复用，又实现了微服务的基本功能，
共享模块非常灵活，模块中所有组件都可以通过异步加载调用，

文档：https://webpack.js.org/concepts/module-federation/

以 webpack-module-federation 为代表的方案

- [Emp](https://github.com/efoxTeam/emp)
- [Module Federation | webpack 中文文档](https://webpack.docschina.org/concepts/module-federation/)
- [vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)

模块联邦主要是一种去中心化的思想，也可以用来做服务拆分， 实现原理比较复杂，主要涉及到以下几个方面：

1. 模块接口定义
在需要共享的模块中，通过 module.exports 或 export 将需要共享的模块封装成一个模块接口，并将其在模块系统中注册。
2. 共享模块的描述信息
在需要共享模块的应用程序中，通过使用 ModuleFederationPlugin 插件，将需要共享的模块的描述信息以 JSON 格式写入配置中。描述信息包括需要共享的模块名称、模块接口、提供共享模块的应用程序的 URL 等。
3. 共享模块的加载
在需要使用共享模块的应用程序中，通过 webpack 的 container 远程加载共享模块的代码，并将其封装成一个容器。容器在当前应用程序中的作用是在容器中运行共享模块的代码，并按照描述信息将导出的模块接口暴露出来。容器本身是一个 JavaScript 运行时环境，它可以在需要使用共享模块的应用程序中被动或主动加载。
4. 远程模块的执行
在容器中加载共享模块的代码后，容器需要将其执行，并将执行过程中产生的模块接口导出。为了实现这个目的，容器会利用 webpack 打包时在编译过程中生成的一个特殊的运行时代码，即 remoteEntry.js，通过 script 标签远程加载到当前应用程序中。在这个特殊的运行时代码中，会封装一些与容器通信的方法，例如 remote 方法，可以用于按需加载模块、获取模块接口等。

综上，webpack-module-federation 基于这些原理，实现了多个独立的应用程序之间的模块共享和远程加载，从而可以实现高度解耦、可扩展的架构。

### Bit：将独立的组件构建、集成和组合到一起和管理前端

具有传统单体式前端的安全性和健壮性，
介接入方式简单、可伸缩性强，
通过 简单的解耦代码库、自治团队、小型定义良好的 API、独立的发布管道 和 持续增量升级，增强工作流程，
文档地址：https://bit.dev/docs/quick-start

### MicroApp：是京东零售推出的基于类WebComponent进行渲染，从组件化的思维实现的微前端技术

- https://github.com/micro-zoe/micro-app
- https://github.com/micro-zoe/micro-app-demo

使用简单，接入微前端成本低，
零依赖，
兼容所有框架（不需要提供脚手架工具），
提供了JS沙箱、样式隔离、元素隔离、预加载、资源地址补全、插件系统、数据通信等一系列完善的功能，
文档：https://zeroing.jd.com/

- [官方 Demo 示例](https://zeroing.jd.com/micro-app/demo/react16)
- [MicroApp - 对vite支持的相关说明](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/framework/vite)

### 无界：腾讯推出的基于 Web Components + iframe 微前端框架，具备成本低、速度快、原生隔离、功能强等一系列优点

- https://github.com/Tencent/wujie
- https://github.com/Tencent/wujie/tree/master/examples

成本低
速度快
原生隔离
功能强大
文档：https://wujie-micro.github.io/doc/

- [官方 react-demo 展示](https://wujie-micro.github.io/demo-main-react/#/home)
- [官方 vue-demo 展示](https://wujie-micro.github.io/demo-main-vue/home)

### EMP

EMP 是欢聚时代基于 Webpack5 Module Federation 搭建的微前端方案，更多的是去支持webpack，用的人也不多。

- [《react项目如何使用和接入EMP》- GitHub](https://github.com/efoxTeam/emp/wiki/%E3%80%8Areact%E9%A1%B9%E7%9B%AE%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8%E5%92%8C%E6%8E%A5%E5%85%A5EMP%E3%80%8B)

## 选择考量

选择微前端方案的时候需要考虑能否解决好以下10个问题

1. 微应用的注册、异步加载和生命周期管理；
2. 微应用之间、主从之间的消息机制；
3. 微应用之间的安全隔离措施；
4. 微应用的框架无关、版本无关；
5. 微应用之间、主从之间的公共依赖的库、业务逻辑(utils)以及版本怎么管理；
6. 微应用独立调试、和主应用联调的方式，快速定位报错（发射问题）；
7. 微应用的发布流程；
8. 微应用打包优化问题；
9. 微应用专有云场景的出包方案；
10. 渐进式升级：用微应用方案平滑重构老项目。

## 如何选择

- 自由度更高：module-federation
  - 需要自定义实现css隔离、js沙箱、路由劫持等功能
- 用的最多：qiankun
  - 相对比较成熟，社区活跃
  - webpack体系、接入相对比较重
- 接入更流畅：wujie、micro-app
- 基于react +vite技术栈，我们最终选择更新更活跃，文档更丰富的micro-app


