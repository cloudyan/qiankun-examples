import { MicroApp, useLocation, Outlet } from '@umijs/max';
import NotFound from '../Exception404'

export default function MicroClient() {
  const location  = useLocation();
  console.log('location', location)

  const pathnameArr = location.pathname.split('/');
  const microAppName = pathnameArr[1]
  const isMicroClient = (window.__microApps__ || []).map(app => app.name).includes(microAppName)

  // 已注册的子应用，可以跳转，否则 404
  console.log('isMicroClient', isMicroClient, microAppName);

  const other = <NotFound info={{status: '404', title: '404', subTitle: 'page is not found'}} />
  // const other = <Outlet />

  return (<div className="microapp-wrapper">
    {isMicroClient ? <MicroApp name={microAppName} autoSetLoading /> : other}
  </div>);
};
