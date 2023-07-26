# FAQ

1. 主应用 devtool 中报错

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

2. umi 应用配置

以下是一些常用的配置，默认值如下

```js
{
  base: '/',
  publicPath: '/',
  outputPath: 'dist',
}
```

3. 主应用是 browser 路由，子应用是 hash 路由的混合模式

此情况，子应用使用 hash 路由，在主应用中会被变成 browser 路由

暂时没有配置出生效

参考文档:

- https://qiankun.umijs.org/zh/cookbook
- https://v3.umijs.org/zh-CN/plugins/plugin-qiankun#changelog
  - 不再支持主应用是 browser 路由模式，子应用是 hash 路由的混合模式。如果有场景需要可以通过自己使用 `<MicroApp />` 组件加载子应用。

4. 子应用之间跳转

如果子应用通过路由绑定的方式引入，在其它子应用的内部，可以使用 `<MicroAppLink />` 跳转到对应的路由。

```jsx
// 跳转到子应用 app2
<MicroAppLink name="app2" to="/home">go App2</MicroAppLink>

// 跳转到主应用
<MicroAppLink isMaster to="/table">
```

微应用之间如何跳转？

参考：

- https://umijs.org/docs/max/micro-frontend#%E5%AD%90%E5%BA%94%E7%94%A8%E4%B9%8B%E9%97%B4%E8%B7%B3%E8%BD%AC
- https://qiankun.umijs.org/zh/faq#%E5%BE%AE%E5%BA%94%E7%94%A8%E4%B9%8B%E9%97%B4%E5%A6%82%E4%BD%95%E8%B7%B3%E8%BD%AC
