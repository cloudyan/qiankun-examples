import { Link, Outlet } from '@umijs/max';
import './index.less'

import MicroClient from '@/components/MicroClient';

// page1

export default function Layout() {
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
            <li><Link to="/slave-umi3/#/page2">Link umi3_page2</Link></li>
          </ul>
          <p>样式被子应用覆盖</p>
        </div>
        <div className="right-main" id="MacroAppRoot"><MicroClient /></div>
      </div>
    </div>
  )
}
