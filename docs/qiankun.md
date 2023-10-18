# 用法

- https://qiankun.umijs.org/zh/guide/getting-started#%E5%BE%AE%E5%BA%94%E7%94%A8
- 推荐 [qiankun 原理](https://juejin.cn/post/7202246519080304697)

## 主应用

### 在主应用中注册微应用

```js
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react app', // app name registered
    entry: '//localhost:7100',
    container: '#yourContainer',
    activeRule: '/yourActiveRule',
    // props: msg, // 共享给子应用数据
  },
  {
    name: 'vue app',
    entry: { scripts: ['//localhost:7100/main.js'] },
    container: '#yourContainer2',
    activeRule: '/yourActiveRule2',
  },
]);

start();
```

当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 qiankun 的匹配逻辑，所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子。

如果微应用不是直接跟路由关联的时候，你也可以选择手动加载微应用的方式：

```js
import { loadMicroApp } from 'qiankun';

loadMicroApp({
  name: 'app',
  entry: '//localhost:7100',
  container: '#yourContainer',
});
```

## 微应用

微应用不需要额外安装任何其他依赖即可接入 qiankun 主应用。

### 导出相应的生命周期钩子

微应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 bootstrap、mount、unmount 三个生命周期钩子，以供主应用在适当的时机调用。

```js
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  ReactDOM.render(<App />, props.container ? props.container.querySelector('#root') : document.getElementById('root'));
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container ? props.container.querySelector('#root') : document.getElementById('root'),
  );
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props);
}
```

### 配置微应用的打包工具

除了代码中暴露出相应的生命周期钩子之外，为了让主应用能正确识别微应用暴露出来的一些信息，微应用的打包工具需要增加如下配置：

webpack5

```js
const packageName = require('./package.json').name;

module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    chunkLoadingGlobal: `webpackJsonp_${packageName}`,
  },
};
```

webpack4

```js
const packageName = require('./package.json').name;

module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    // webpack5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
    jsonpFunction: `webpackJsonp_${packageName}`,
  },
};
```

上面的配置做了什么？

要把微应用打包成 umd 库格式，为什么？

qiankun 为什么需要将子应用输出为 umd ?

> qiankun 架构下的子应用通过webpack 的 umd 输出格式来做，让父应用在执行子应用的 js 资源时可以通过 eval，将 window 绑定到一个 Proxy 对象上，以此来防止污染全局变量，方便对脚本的 window 相关操作做劫持处理，达到子应用之间的脚本隔离。
>
> https://juejin.cn/post/6893376571978022926

## single-spa 入门

qiankun 是基于 [single-spa](https://github.com/single-spa/single-spa) 实现的，因此我们有必要了解 single-spa，它也是一个微前端框架。

single-spa 被加载的子应用中，其加载路径对应的资源必须是一个js文件，js文件中必须通过export导出三个函数：bootstrap、mount、unmount，这三个函数会作为生命周期钩子函数在 singleSpa 获取子应用资源后被依次执行。

当我们的子应用使用了vue或者react时，我们可以分别使用single-spa-vue和single-spa-react这两个库去生成上述三个函数

### 站在single-spa的肩膀上，qiankun做了什么？

`qiankun` 与 `single-spa` 最大的区别是：`single-spa` 提供的注册子应用 API `registerApplication` 中，请求的子应用资源类型是 `js`。而 `qiankun` 提供的注册子应用 API `registerMicroApps` 中，请求的子应用资源是 `html` 文件，即子应用打包后的入口页面

而 `registerMicroApps` 内部调用了 `single-spa` 的 `registerApplication`。下面用伪代码的形式展示是如何调用的：

```js
// 伪代码形式展示registerMicroApps内部细节
registerApplication({
  name,
  app: async () => {
    // 1. 加载和解析`html`资源，获取页面、样式资源链接、脚本资源链接三种数据
    // 2. 对外部样式资源（css）进行加载处理，生成`render`函数
    // 3. 生成 `js`沙箱
    // 4. 加载外部脚本资源（js），且进行包装、执行
    // 5. 从入口文件里获取生命周期钩子函数：`bootstrap`、`mount`、`unmount`，然后当作registerApplication的app形参中的返回数据，如下所示
    return {
      bootstrap,
      mount:[
        // `render`函数用于把处理后的html页面插入到应用基座上
        render()
        mount()
      ],
      unmount,
    };
  },
  activeWhen: activeRule,
  customProps: props,
});
```

详细解析

1. 加载和解析html资源
   1. `qiankun` 会调用 `import-html-entry` 这个第三方库去加载和处理 `html` 资源。`import-html-entry` 会在获取 `html` 页面后会通过正则表达式解析并提取其中的 `link` 元素和 `script` 元素。
   2. 经过解析后会返回 `template`(html页面)、`scripts`(script外链或脚本内容列表)、`entry`(js入口文件链接)、`styles`(links外链列表)四个值
      1. `template`
         1. 对内联脚本 和 资源类型为 `javascript` 的`script`取替成`<!-- xxx.js replaced by import-html-entry -->`标志位
         2. 对资源类型为`stylesheet`的`link`取替成`<!-- xxx.css replaced by import-html-entry -->`标志位
      2. `scripts` 集成所有 内联脚本 和 资源类型为`javascript`的`script`外链
      3. entry: 如果存在带entry的script元素，则entry为script元素的外链或内联脚本。否则为scripts最后的元素
      4. styles: 集成所有 资源类型为stylesheet的link外链
2. 对外部样式资源（css）进行加载处理，生成 `render` 函数
   1. 对上一步骤中获取的styles，也就是样式资源外链进行请求，拿到css代码，然后生成内联样式`<style>xxx</style>`插入且取替步骤一中`template`对应的标志位上
   2. render函数用于把上述的template插入到应用基座上。render函数会在single-spa里的mount生命周期中执行，即放入到registerApplication的app参数的返回的mount属性里。
3. 生成 js沙箱
   1. qiankun会根据用户设置的sandbox属性来生成 js沙箱，js沙箱 用于隔离应用间的window环境，防止子应用在执行代码期间影响了其他应用设置在window上的属性。
   2. qiankun内置的沙箱有三种：ProxySandbox、LegacySandbox、SnapshotSandbox，使用场景如下所示：
      1. `ProxySandbox`：sandbox没有设置或设置为true，且浏览器环境支持ES6-Proxy类
      2. `LegacySandbox`：sandbox设置为对象，且浏览器环境支持ES6-Proxy类
      3. `SnapshotSandbox`：浏览器环境不支持ES6-Proxy类
4. 加载外部脚本资源（js），且进行包装、执行
   1. 开始对scripts列表中的外链进行资源请求，获取到的js代码
   2. 然后对所有请求获取的js代码和内联脚本都进行包装以修改其作用域上的window
5. 从入口文件里获取生命周期钩子函数：bootstrap、mount、unmount，然后交给single-spa去调用执行
   1. 会把beforeLoad和beforeMount等周期函数的执行逻辑安插在registerApplication的app返回的声明周期函数中。

```js
// html 解析
// 对 内联脚本 和 资源类型为javascript 的script取替成<!-- xxx replaced by import-html-entry -->标志位
// 对资源类型为stylesheet的link取替成<!-- xxx replaced by import-html-entry -->标志位
template = ` <html lang="en"> <head> <meta charset="utf-8" /> <link rel="icon" href="/favicon.ico" /> <title>React App</title> <!-- link http://xxx/react-app/static/css/main.css replaced by import-html-entry --> <style type="text/css"> .contaier { width: auto; } </style> </head> <body> <div id="root"></div> <!-- inline scripts replaced by import-html-entry --> <!-- script http://xxx/react-app/static/js/chunk1.js replaced by import-html-entry --> <!-- script http://xxx/react-app/static/js/main.js replaced by import-html-entry --> </body> </html> `;

// 集成所有 内联脚本 和 资源类型为javascript的script外链
scripts = [
  "\x3Cscript>\n function(){}\n \x3C/script>",
  "http://xxx/react-app/static/js/chunk1.js",
  "http://xxx/react-app/static/js/main.js",
];

// 如果存在带entry的script元素，则entry为script元素的外链或内联脚本。否则为scripts最后的元素
entry = "http://xxxx/react-app/static/js/main.js";

// 集成所有 资源类型为stylesheet的link外链
styles = ["http://xxx/react-app/static/css/main.css"];
```

```js
// 简化版的 ProxySandbox 源码
export default class ProxySandbox implements SandBox {
  // 用于记录更改过的window属性
  private updatedValueSet = new Set<PropertyKey>();
  name: string;
  // 用于存放全局对象Window
  globalContext: typeof window;
  // 用于记录最后被修改的属性
  latestSetProp: string | number | symbol | null = null;

  constructor(name: string, globalContext = window) {
    this.name = name;
    this.globalContext = globalContext;

    // createFakeWindow会创建一个纯对象，然后把全局对象Window所有属性及其值复制到该纯对象上
    const { fakeWindow } = createFakeWindow(globalContext);

    // 创建以fakeWindow作为目标对象的Proxy实例
    this.proxy = new Proxy(fakeWindow, {
      set: (target: FakeWindow, p: PropertyKey, value: any): boolean => {
          // We must kept its description while the property existed in globalContext before
          if (!target.hasOwnProperty(p) && globalContext.hasOwnProperty(p)) {
            const descriptor = Object.getOwnPropertyDescriptor(globalContext, p);
            const { writable, configurable, enumerable } = descriptor!;
            if (writable) {
              Object.defineProperty(target, p, {
                configurable,
                enumerable,
                writable,
                value,
              });
            }
          } else {
            // @ts-ignore
            target[p] = value;
          }
          // 白名单制度，如果修改的属性在白名单里，则会把值同步到全局对象Window上
          if (variableWhiteList.indexOf(p) !== -1) {
            // @ts-ignore
            globalContext[p] = value;
          }

          updatedValueSet.add(p);

          this.latestSetProp = p;

          return true;
      },
      get: (target: FakeWindow, p: PropertyKey): any => {
        return ? (globalContext as any)[p]
          : p in target
          ? (target as any)[p]
          : (globalContext as any)[p];
      },
    })
}
```

`ProxyWindow`里创建了一个带有全局对象`Window`所有属性及其值 `fakeWindow` ，然后再创建了以 `fakeWindow` 为目标对象的`Proxy`实例。当我们在子应用中通过`window['a']=1`新增或修改属性时，会触发`Proxy`实例的handler.set方法执行，此时他会做以下操作：

1. 修改 `fakeWindow` 的`"a"`属性为 1
2. 如果是修改`System`等一些在白名单属性里的值，则会先把`Window`中的['xx']的目前值备份一下，然后在把新的值覆盖到`Window`的属性中（当子应用销毁时，会把备份的值重置到原本属性中）。但大多数属性包括`"a"`都不在白名单属性中，因此是不会修改到`Window`的同名属性里的。

```js
// 示例效果
// 1. 主应用加载时定义window.app
window.app = "masterapp";

// 2. 子应用读取window.app的值
console.log(window.app); // 显示'master-app'

// 3. 子应用A更改window.app的值，然后在子应用A中读取是'micro-a'，但如果在主应用中读取依旧是'master-app'
window.app = "micro-a";
console.log(window.app); // 'micro-a'

// 3. 切换到子应用B且读取window.app的值时，此时子应用A已销毁，window.app会从'micro-a'撤回为'masterapp'
console.log(window.user); // 'master-app'
```

总的来说，qiankun设置这种js沙箱是为了隔离子应用和主应用的window。但目前存在一个缺点：这种沙箱只能隔离Window的一级属性。因为Proxy只会捕获到一级属性的增删改，不能捕获到二级以上属性的变动，我们可以通过下图的控制台操作得出此结论：

```js
// script 外链内容如下
// http://xxx/react-app/static/js/chunk1.js
function fn1() {
  window["micro-app"] = "dsn";
}
fn1();


// 包装后
;(function(window, self, globalThis){
  with(window){
    function fn1() {
      window["micro-app"] = "dsn";
    }
    fn1();
  }
  //# sourceURL=http://xxx/react-app/static/js/chunk1.js
).bind(window.proxy)(window.proxy, window.proxy, window.proxy);
```

其中window.proxy是上一步中生成的js沙箱，通过bind传入到匿名函数的作用域里，然后再通过with语句把window的指向从全局对象Window切换到该js沙箱。从而让子应用的js代码执行过程中，调用的window其实是一个目标对象为fakeWindow的Proxy实例，从而完成了应用间window的隔离。

最终上面包装后的代码会用 `eval` 执行。

qiankun 要求 webpack 子项目输出 library umd 包

我们来说一下library，它用于在执行环境中插入一个全局对象，该全局对象会包含入口文件中通过export导出的所有方法，例如如果我在名为 `react-ts-app` 子应用里打印`window["react-ts-app-main"]`：

注意这个插入过程是对子应用的window进行的，也就是js沙箱中的proxy，因此如果在控制台里直接打印window["react-ts-app-main"]是不会输出以上结果的。

因此我们在入口文件在上一步骤中包装且eval执行后，qiankun 会通过等同于`Object.keys(window).pop()`获取到最新插入的属性`"react-ts-app-main"`，然后通过`window["react-ts-app-main"]`拿到这些生命周期钩子函数。最终这些生命周期钩子函数用作single-spa的`registerApplication`的app的返回数据里。从而完成了从解析html到把入口文件中的生命周期钩子函数交给single-spa调用的整个过程。

## 隔离的原理

子应用和基座的隔离主要有两点：

1. 样式隔离
2. js 隔离

### 样式隔离

要想做到子应用和基座之间的样式不会相互干扰，首先要做的就是样式隔离。

qiankun 提供了 3 种模式来实现不同效果的样式隔离：

1. **动态载入 CSS(默认)** - 代码中的配置为 `sandbox = true`，这种模式的做法是直接将子应用的样式（css 列表）全部直接加载到子应用挂载的 DOM 节点内，这样在卸载子应用的时候，移除该 DOM 节点，就可以自动去掉子应用使用的 css。但这种模式可能会导致子应用内的样式影响到基座。（例如子应用内和基座对同一个 id 的 DOM 元素配置了样式）
2. **Shadow DOM 样式隔离** - 代码中的配置为 `sandbox.strictStyleIsolation = true`，这种模式是使用浏览器原生的 Shadow DOM(mode = open) 实现，从而达到 Shadow Root 下的 css 无法影响到外部。参考链接：[Shadow DOM](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM)
3. **Scoped CSS 样式隔离** - 代码中的配置为 `sandbox.experimentalStyleIsolation = true`。这种模式通过为 css 选择器添加 [data-...] 限制，从而实现样式的隔离，这种模式可以做到应用内的样式不会影响到外部。

```js
// Shadow DOM 的开关
let shadow = elementRef.attachShadow({ mode: "open" });
let shadow = elementRef.attachShadow({ mode: "closed" });
```

第 2，3 种方案能够做到完全隔离，第一种会影响基座，但为什么 qiankun 默认的是第 1 种方案呢？

因为「模态框」、「引导框」这样的组件，需要挂载到 body 上。

所以综合权衡之下，qiankun 默认使用方案 1，通过人为约束子应用样式和基座区分开，也可以做到既满足弹框遮罩的场景，又实现基座和子应用样式互不影响。

### js 隔离

js 隔离的核心是在基座和子应用中使用不同的上下文 (global env)，从而达成基座和子应用之间 js 运行互不影响。

> 简单来说，就是给子应用单独的 window，避免对基座的 window 造成污染。

qiankun 在 js 隔离上，同样提供了 3 种方案，分别是：

1. `LegacySandbox` - 传统 js 沙箱，目前已弃用，需要配置 `sandbox.loose = true` 开启。此沙箱使用 Proxy 代理子应用对 window 的操作，将子应用对 window 的操作同步到全局 window 上，造成侵入。但同时会将期间对 window 的新增、删除、修改操作记录到沙箱变量中，在子应用关闭时销毁，再根据记录将 window 还原到初始状态。
2. `ProxySandbox` - 代理 js 沙箱，非 IE 浏览器默认使用此沙箱。和 `LegacySandbox` 同样基于 Proxy 代理子应用对 window 的操作，和 `LegacySandbox` 不同的是，`ProxySandbox` 会创建一个虚拟的 window 对象提供给子应用使用，哪怕是在运行时，子应用也不会侵入全局 window，实现完全的隔离。
3. `SnapshotSandbox` - 快照 js 沙箱，IE 浏览器默认使用此沙箱。因为 IE 不支持 Proxy。此沙箱的原理是在子应用启动时，创建基座 window 的快照，存到一个变量中，子应用的 window 操作实质上是对这个变量操作。`SnapshotSandbox` 同样会将子应用运行期间的修改存储至 `modifyPropsMap` 中，以便在子应用创建和销毁时还原。

> 注：样式隔离、JS 隔离都在会子应用 mount 前，bootstrap 时处理。

当然除了这些基本的隔离处理之外，qiankun 还提供了对 window 的各种监听和定时器的 Hook，保证子应用完整的销毁。

## 通信、路由的原理

相比于上文子应用隔离的原理而言，通信和路由更加偏向于应用，qiankun 在这两方面的设计基于微前端理念中的「低耦合度」。技术实现则是直接基于 single-spa 的基础，做了一点简单的扩展。

### 通信的原理

在通信部分，qiankun 提供了全局的 state 供子应用和基座使用。同时提供了 2 个函数供子应用操作使用，分别是：

1. `onGlobalStateChange: (callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) => void` 在当前应用监听全局状态，有变更触发 callback，fireImmediately = true 立即触发 callback
2. `setGlobalState: (state: Record<string, any>) => boolean` 按一级属性设置全局状态，子应用中只能修改已存在的一级属性

> 注：`setGlobalState` 子应用仅能对全局 state 已存在的一级属性做修改，不能对 state 新增或删除属性。`onGlobalStateChange` 监听数据变化同样只针对于 state 已存在的一级属性。

这样设计的目的是想把全局 state 的掌控权交给基座主应用，避免子应用乱操作。

如果以上数据的通信不够用，也可以使用 `window.addEventListener` 直接进行事件通信。

### 路由的原理

qiankun 提供单实例（单个子应用）和多实例（多个子应用同时显示）模式。这里我们只讨论单实例模式，多实例模式目前还处于实验性阶段，多实例路由目前无法使用。

单实例模式下，qiankun 支持子应用使用 hash 和 history 两种路由模式，如果使用 history 需要设置 base。

qiankun 在 registerMicroApps 中获取应用激活规则和入口地址，在规则触发时就会加载该子应用，子应用加载完成后，应用内路由的权利就完全交给子应用了。

如果子应用资源使用的相对路径加载，那么子应用需要在被加载的第一时间指定 `webpack_public_path` 然后再初始化。代码如下：

```js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

这一步，qiankun 将子应用在基座中配置的入口地址传递给子应用，子应用指定 `webpack_public_path` 后即可正确加载页面资源。

## 项目实践

- https://qiankun.umijs.org/zh/guide/tutorial

参考：

- 推荐 [qiankun 原理](https://juejin.cn/post/7202246519080304697)
- [微前端架构详解 - 乾坤](http://blog.jcr.pub/2021/04/28/the-architecture-of-micro-frontends-qiankun/)
- [微前端框架 之 single-spa 从入门到精通](https://juejin.cn/post/6862661545592111111)
  - https://github.com/liyongning/micro-frontend
  - 思维导图 https://www.processon.com/view/link/5f3b53d57d9c0806d41e1a72#map
- [什么是微前端？](https://zhuanlan.zhihu.com/p/458979302)
  - 基于 vite + systemjs 实现, 核心不足 100 行代码
  - https://github.com/MinJieLiu/micro-app
