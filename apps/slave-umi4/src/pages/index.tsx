import { Button, Modal } from 'antd';
// import yayJpg from '../assets/yay.jpg';

export default function HomePage() {

  const handleClick = () => {
    Modal.success({
      title: `当前应用`,
      content: 'hello slave-umi4',
    })
  }

  return (
    <div>
      <h2>微应用 umi4</h2>
      <p><Button type="primary" onClick={handleClick}>弹框</Button> 紫色主题</p>
      <p>页面 Home</p>
    </div>
  );
}
