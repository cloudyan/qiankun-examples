import { Button, Modal } from 'antd';
import yayJpg from '../assets/yay.jpg';

export default function HomePage() {

  const handleClick = () => {
    Modal.success({
      title: `当前应用`,
      content: 'hello',
    })
  }

  return (
    <div>
      <h2>微应用 umi4</h2>
      <p><Button type="primary" onClick={handleClick}>按钮</Button> 紫色主题</p>
      <p>
        <img src={yayJpg} width="388" />
      </p>
      <p>
        To get started, edit <code>pages/index.tsx</code> and save to reload.
      </p>
    </div>
  );
}
