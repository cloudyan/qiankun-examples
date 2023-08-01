import {
  // connectMaster, // plugin-qiankun
  useHistory,
  useModel,
} from 'umi';
import { Button, Modal } from 'antd';

// 验证
// 样式隔离，定制主题
// 弹窗样式不丢失

export default function One(props: any) {

  const handleClick = () => {
    Modal.success({
      title: `当前应用`,
      content: 'hello',
    })
  }

  return (
    <>
      <h2>微应用 umi3</h2>
      <p><Button type="primary" onClick={handleClick}>按钮</Button> 红色主题</p>
      {/* TODO: 主题在微应用内被覆盖了 */}
      <p>页面 home</p>
    </>
  )
}
