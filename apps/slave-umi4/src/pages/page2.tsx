import {Link, MicroAppLink} from '@umijs/max'
import { Button } from 'antd';

export default function Page1() {
  return (
    <div>
      <h3>页面 2</h3>
      {/* 手动加载的子应用，未添加到主应用，查找失败提示 console 错误 */}
      {/* <p><MicroAppLink name="/purehtml" to="/"><button>go Purehtml</button></MicroAppLink></p> */}
      {/* <p><MicroAppLink name="/" to="/purehtml"><button>go Purehtml</button></MicroAppLink></p> */}
      <p><MicroAppLink isMaster to="/purehtml"><Button type="primary">go Purehtml</Button></MicroAppLink> ✅</p>
      <p><MicroAppLink isMaster to="/slave-umi3/#/page1"><Button type="primary">MicroAppLink umi3_page1</Button></MicroAppLink> ✅</p>
      <p><MicroAppLink name="slave-umi3" to="/slave-umi3/#/page1"><Button type="primary">MicroAppLink umi3_page1</Button></MicroAppLink> ✅</p>
      <p><MicroAppLink isMaster to="/home"><Button type="primary">MicroAppLink home</Button></MicroAppLink> ✅</p>
      <p><Link to="/slave-umi3/#/page1"><Button type="primary">Link umi3_page1</Button></Link> 🚫 无效</p>
      <p><a href="/slave-umi3/#/page1"><Button type="primary">a umi3_page1</Button></a> ❌ 导致刷新</p>
    </div>
  );
}
