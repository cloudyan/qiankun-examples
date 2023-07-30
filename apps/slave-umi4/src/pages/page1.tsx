
import { Link, Outlet } from '@umijs/max';
import { Button } from 'antd'

export default function Page1() {
  const getHashUrl = (path: string, isLink: boolean = false) => {
    const {pathname } = window.location
    return isLink ? path : `${pathname}#${path}`
  }
  const getHistoryUrl = (path: string, isLink: boolean = false) => {
    let {pathname } = window.location
    pathname = '/' + pathname.split('/')[1]
    return isLink ? path : `${pathname}${path}`
  }

  const goHistoryUrl = (path: string) => {
    history.pushState({}, '', getHistoryUrl(path))
  }

  const isHashUrl = !!location.hash
  return (
    <div>
      <p>页面 1</p>
      {/* 路由模式引入子应用，不能直接使用 a 或 location.href，会导致刷新主应用 */}
      {/* MicroApp 组件模式引入子应用，使用以下方式跳转都没问题 */}

      { isHashUrl ? (
        <>
          <h3>hash 路由测试</h3>
          <p>MicroApp 组件模式引入子应用，跳转没问题</p>
          <ol>
            <li><p><a href={getHashUrl('/page2')}>Go 页面2(a 标签)</a></p></li>
            <li><p><Button type="primary" onClick={() => window.location.href = getHashUrl('/page2')}>Go 页面2(location.href)</Button></p></li>
            <li><p><Link to={getHashUrl('/page2', true)}>Go 页面2(Link 组件)</Link></p></li>
          </ol>
        </>
        ) : (
          <>
            <h3>history 路由测试</h3>
            <p>路由模式引入子应用，a 或 location.href 跳转会有问题</p>
            <ol>
              <li><p><a href={getHistoryUrl('/page2')}>Go 页面2(a 标签)</a></p></li>
              <li><p><Button type="primary" onClick={() => window.location.href = getHistoryUrl('/page2')}>Go 页面2(location.href)</Button></p></li>
              <li><p><Link to={getHistoryUrl('/page2', true)}>Go 页面2(Link 组件)</Link></p></li>
            </ol>

            <h3>疑问</h3>
            <p>问题 1：路由模式引入适用 hash 路由的子应用，是否可以继续保持 hash 路由</p>
            <p>问题 2：hash 默认可以不刷新，那么 history 模式是不是也可以（确实可以，使用 history.pushState，如下）</p>
            <ol>
              <li><p><Button type="primary" onClick={() => goHistoryUrl('/page2')}>Go 页面2(history.pushState)</Button></p></li>
            </ol>
            <p>问题 3：a 标签不行（浏览器行为，默认刷新），那怎么办？</p>
            <p>Link 组件渲染出来就是 a 标签，但可以无刷新跳转，本质还是 hashchange, pushState，阻止 a 标签默认行为</p>
            <p>问题 4：上面的跳转方式，支持<b>跨子应用无刷新跳转</b>吗？</p>
          </>
      ) }


    </div>
  );
}
