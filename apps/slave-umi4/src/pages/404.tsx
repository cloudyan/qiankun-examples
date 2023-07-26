import {MicroAppLink} from '@umijs/max'

export default function Page1() {
  return (
    <div>
      <p>404 页面</p>
      <p><MicroAppLink name="purehtml" to="/"><button>go Purehtml</button></MicroAppLink></p>
    </div>
  );
}
