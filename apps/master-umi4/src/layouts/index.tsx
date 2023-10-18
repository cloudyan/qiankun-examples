import { Link, Outlet } from '@umijs/max';
import './index.less'

import MicroClient from '@/components/MicroClient';

// page1

window.addEventListener('hashchange', (...rest) => {
  console.warn('hashchange', rest)
})

// 解析 path url string
// 示例 '/slave-umi3/#/page1?id=12'
// 拆分 pathname pathQueryStr hash hashQueryStr

function parseQueryStr(queryStr: string = '') {
  return queryStr.split('&').reduce((obj: any, item) => {
    if (item) {
      const temp = item.split('=');
      const key: string = decodeURIComponent(temp[0]) || ''
      const value = decodeURIComponent(temp[1] || '')
      obj[key] = value;
    }
    return obj
  }, {})
}
function stringifyQueryObj(queryObj: any = {}) {
  const result = []
  for (let key in queryObj) {
    if (queryObj.hasOwnProperty(key)) {
      let value = queryObj[key]
      if (![undefined, null].includes(value)) {
        if (typeof value === 'object') {
          value = JSON.stringify(value)
        }
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      }
    }
  }
  return result.join('&')
}
function urlfix(path: string = '', queryStr: string = '') {
  return queryStr ? `${path}?${queryStr}` : path;
}
function parseUrl(url: string = '') {
  const tempUrl = url.replace(/\?/g, '&').replace('&', '?');
  const hashSplitArr = tempUrl.split('#');

  const [pathname, pathQueryStr = ''] = hashSplitArr[0].split('?');
  const [hashName = '', hashQueryStr = ''] = (hashSplitArr[1] || '').split('?');

  const queryObj = parseQueryStr(`${pathQueryStr}&${hashQueryStr}`)
  const queryStr = stringifyQueryObj(queryObj)
  const hash = hashName ? `#${hashName}` : ''

  return {
    pathname,
    hash,
    queryObj,
    queryStr,
    url: urlfix(`${pathname}${hash}`, queryStr)
  }
}


export default function Layout() {
  const jumpUrl = (path: string) => {
    // 子应用统一使用 history 路由
    // history.pushState({}, '', path)

    // 子应用使用 hash 路由，可统一为 umi3 形式跳转（修复 hashchange 触发）
    const obj = parseUrl(path);
    console.log(obj.pathname, obj.url)
    history.pushState({}, '', obj.pathname)
    if (obj.hash) {
      location.href = obj.url;
    }

    // if (path.startsWith('/slave-umi3/')) {
    //   const obj = parseUrl(path);
    //   history.pushState({}, '', obj.pathname)
    //   if (obj.hash) {
    //     location.href = obj.url;
    //   }
    // } else {
    //   history.pushState({}, '', path)
    // }
  }

  return (
    <div className="layout-master">
      <div className="top-header">
        <h2>header</h2>
      </div>
      <div className="container">
        <div className="left-menu">
          <ul>
            <li><Link to="/home">home</Link></li>
            <li><Link to="/theme">theme</Link></li>
            {/* 子应用使用 hash 路由 */}
            <li><Link to="/slave-umi4/#/page1">Link umi4_page1</Link></li>
            <li><Link to="/slave-umi4/#/page2">Link umi4_page2</Link></li>
            <li><Link to="/slave-umi3/#/page1">Link umi3_page1</Link></li>
            <li><Link to="/slave-umi3/#/page2">Link umi3_page2</Link></li>
            <li><p onClick={() => jumpUrl("/slave-umi4/#/page1")}>p umi4_page1</p></li>
            <li><p onClick={() => jumpUrl("/slave-umi4/#/page2")}>p umi4_page2</p></li>
            <li><p onClick={() => jumpUrl("/slave-umi3/#/page1?id=1")}>p umi3_page1</p></li>
            <li><p onClick={() => jumpUrl("/slave-umi3/#/page2?id=2")}>p umi3_page2</p></li>

            {/* 全使用 history 路由 */}
            {/* <li><Link to="/slave-umi4/page1">Link umi4_page1</Link></li>
            <li><Link to="/slave-umi4/page2">Link umi4_page2</Link></li>
            <li><Link to="/slave-umi3/page1">Link umi3_page1</Link></li>
            <li><Link to="/slave-umi3/page2">Link umi3_page2</Link></li>
            <li><p onClick={() => jumpUrl("/slave-umi4/page1")}>p umi4_page1</p></li>
            <li><p onClick={() => jumpUrl("/slave-umi4/page2")}>p umi4_page2</p></li>
            <li><p onClick={() => jumpUrl("/slave-umi3/page1?id=1")}>p umi3_page1</p></li>
            <li><p onClick={() => jumpUrl("/slave-umi3/page2?id=2")}>p umi3_page2</p></li> */}
          </ul>
          <p>样式被子应用覆盖</p>
        </div>
        <div className="right-main" id="MacroAppRoot"><MicroClient /></div>
      </div>
    </div>
  )
}
