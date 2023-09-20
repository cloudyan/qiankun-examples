import { MicroApp, useLocation, Outlet } from '@umijs/max';

export default function MicroClient() {
  const location  = useLocation();
  console.log('location', location)

  const pathnameArr = location.pathname.split('/');
  const microAppName = pathnameArr[1]
  const isMicroClient = (window.__microApps__ || []).map(app => app.name).includes(microAppName)

  console.log('isMicroClient', isMicroClient, microAppName);
  return (<div className="microapp-wrapper">
    {isMicroClient ? <MicroApp name={microAppName} autoSetLoading /> : <Outlet />}
  </div>);
};
