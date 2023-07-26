
import { Link, Outlet } from '@umijs/max';

export default function Page1() {
  return (
    <div>
      <p>页面 1</p>
      {/* 不能直接使用 a 或 location.href，会导致刷新主应用 */}
      <p><a href="/slave-umi4/page2">Go 页面2(a 标签)</a></p>
      <p><button onClick={() => window.location.href = '/page2'}>Go 页面2(location.href)</button></p>
      <p><Link to="/slave-umi4/page2">Go 页面2(Link)</Link></p>
    </div>
  );
}
