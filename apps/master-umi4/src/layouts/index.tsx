import { Link, Outlet } from '@umijs/max';
import './index.less'

import MicroClient from '@/components/MicroClient';

// page1

window.addEventListener('hashchange', (...rest) => {
  console.warn('hashchange', rest)
})

// 取 hash page
// url = '/slave-umi3/#/page1?id=12'
function parseUrl(url: string = '') {
  const urlArr = url.split('#') || '';
  const pathArr = urlArr[0].split('?');
  const pathname = pathArr[0];
  const pathQueryStr = pathArr[1] || ''
  const hashStr = urlArr[1] || '';
  const hashArr = hashStr.split('?');
  const hash = hashArr[0] || ''
  const hashQueryStr = hashArr[1] || '';

  const query = `${pathQueryStr}&${hashQueryStr}`.split('&').reduce((obj, item) => {
    if (item) {
      const temp = item.split('=');
      const key = decodeURIComponent(temp[0]) || ''
      const value = decodeURIComponent(temp[1] || '')
      obj[key] = value;
    }
    return obj
  }, {})

  const result = []
  for (let key in query) {
    result.push(`${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
  }
  const queryStr = result.join('&')

  return {
    pathname,
    hash,
    query,
    queryStr,
    url: `${pathname}#${hash}?${queryStr}`
  }
}

export default function Layout() {
  const jumpUrl = (path: string) => {
    // 可统一为 umi3 形式跳转
    const obj = parseUrl(path);
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
            <li><Link to="/slave-umi4/#/page1">Link umi4_page1</Link></li>
            <li><Link to="/slave-umi4/#/page2">Link umi4_page2</Link></li>
            <li><Link to="/slave-umi3/#/page1">Link umi3_page1</Link></li>
            <li><Link to="/slave-umi3/#/page2">Link umi3_page2</Link></li>
            <li><p onClick={() => jumpUrl("/slave-umi4/#/page1")}>p umi4_page1</p></li>
            <li><p onClick={() => jumpUrl("/slave-umi4/#/page2")}>p umi4_page2</p></li>
            <li><p onClick={() => jumpUrl("/slave-umi3/#/page1?id=1")}>p umi3_page1</p></li>
            <li><p onClick={() => jumpUrl("/slave-umi3/#/page2?id=2")}>p umi3_page2</p></li>
          </ul>
          <p>样式被子应用覆盖</p>
        </div>
        <div className="right-main" id="MacroAppRoot"><MicroClient /></div>
      </div>
    </div>
  )
}
