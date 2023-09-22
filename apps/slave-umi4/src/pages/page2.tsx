import {Link, MicroAppLink} from '@umijs/max'
import { Button } from 'antd';

export default function Page1() {

  const getHistoryUrl = (path: string, isLink: boolean = false) => {
    let {pathname } = window.location
    pathname = '/' + pathname.split('/')[1]
    return isLink ? path : `${pathname}${path}`
  }

  const goHistoryUrl = (path: string, bool: boolean = false) => {
    history.pushState({}, '', getHistoryUrl(path, bool))
  }

  return (
    <div>
      <h3>页面 2</h3>
      {/* 手动加载的子应用，未添加到主应用，查找失败提示 console 错误 */}
      {/* <p><MicroAppLink name="/purehtml" to="/"><button>go Purehtml</button></MicroAppLink></p> */}
      {/* <p><MicroAppLink name="/" to="/purehtml"><button>go Purehtml</button></MicroAppLink></p> */}

      <p><Button type="primary" onClick={() => goHistoryUrl('/slave-umi3/#/page2', true)}>umi3_page2(history.pushState)</Button></p>

      {/* <p><MicroAppLink isMaster to="/purehtml"><Button type="primary">go Purehtml</Button></MicroAppLink> ✅</p> */}
      <p><MicroAppLink isMaster to="/slave-umi3/#/page2"><Button type="primary">MicroAppLink umi3_page1</Button></MicroAppLink> ✅</p>
      {/* 跨子应用跳转，都应该用上面这种，下面的用法有异常 */}
      {/* <p><MicroAppLink name="slave-umi3" to="/slave-umi3/#/page1"><Button type="primary">MicroAppLink umi3_page1</Button></MicroAppLink> ✅⛔️ 路由绑定引入子应用时异常, 使用 MircoApp 引入子应用正常</p> */}
      {/* <p><MicroAppLink name="slave-umi3" to="/page1"><Button type="primary">MicroAppLink umi3_page1</Button></MicroAppLink> ✅⛔️ 路由绑定引入子应用时正常, 使用 MircoApp 引入子应用异常</p> */}
      <p><MicroAppLink isMaster to="/home"><Button type="primary">MicroAppLink home</Button></MicroAppLink> ✅</p>
      <p><Link to="/slave-umi3/#/page1"><Button type="primary">Link umi3_page1</Button></Link> 🚫 无法跨应用跳转（内部跳）</p>
      <p><a href="/slave-umi3/#/page1"><Button type="primary">a umi3_page1</Button></a> ❌ 导致刷新</p>
    </div>
  );
}
