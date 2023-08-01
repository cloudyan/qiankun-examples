import {
  // connectMaster, // plugin-qiankun
  useHistory,
  useModel,
} from 'umi';
import { Button } from 'antd';

export default function One(props: any) {

  return (
    <>
      <p>页面 page1</p>
      <Button type='primary'>按钮 page1</Button>
    </>
  )
}
