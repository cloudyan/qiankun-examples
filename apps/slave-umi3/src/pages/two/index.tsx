import {
  // connectMaster, // plugin-qiankun
  useHistory,
  useModel,
} from 'umi';
import { Button } from 'antd';

export default function One(props: any) {

  return (
    <>
      <p>页面 page2</p>
      <Button type="primary">按钮 page2</Button>
    </>
  )
}
