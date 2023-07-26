import {MicroAppLink} from '@umijs/max'

export default function Page1() {
  return (
    <div>
      <p>页面 2</p>
      {/* 手动加载的子应用，未添加到主应用，查找失败提示 console 错误 */}
      {/* <p><MicroAppLink name="/purehtml" to="/"><button>go Purehtml</button></MicroAppLink></p> */}
      {/* <p><MicroAppLink name="/" to="/purehtml"><button>go Purehtml</button></MicroAppLink></p> */}
      <p><MicroAppLink isMaster to="/purehtml"><button>go Purehtml</button></MicroAppLink></p>
    </div>
  );
}
