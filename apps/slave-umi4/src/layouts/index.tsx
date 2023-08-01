import { Link, Outlet } from '@umijs/max';
// import 'antd/dist/antd.css';
import './index.less';

export default function Layout() {
  return (
    <div className="navs">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/page1">Page1</Link>
        </li>
        <li>
          <Link to="/page2">Page2</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
