import {
  Link,
  // connectMaster, // plugin-qiankun
  useHistory,
  useModel,
  // MicroAppLink, // umi3 没有
} from 'umi';
import { Button } from 'antd';

export default function One(props: any) {

  const getHistoryUrl = (path: string, isLink: boolean = false) => {
    let {pathname } = window.location
    pathname = '/' + pathname.split('/')[1]
    return isLink ? path : `${pathname}${path}`
  }

  const goHistoryUrl = (path: string, bool: boolean = false) => {
    history.pushState({}, '', getHistoryUrl(path, bool))
  }

  return (
    <>
      <h3>页面 page2</h3>
      <p><Button type="primary">按钮 page2</Button></p>
      {/* <p><MicroAppLink isMaster to="/slave-umi3/#/page1"><Button type="primary">MicroAppLink umi3_page1</Button></MicroAppLink></p>
      <p><MicroAppLink isMaster to="/home"><Button type="primary">MicroAppLink home</Button></MicroAppLink></p> */}
      <p><Button type="primary" onClick={() => goHistoryUrl('/slave-umi4/#/page2', true)}>umi4_page2(history.pushState)</Button></p>
      <p><Link to="/slave-umi4/#/page1"><Button type="primary">Link umi4_page1</Button></Link> 🚫 无效</p>
      <p><a href="/slave-umi4/#/page1"><Button type="primary">a umi4_page1</Button></a> ❌ 导致刷新</p>
    </>
  )
}
