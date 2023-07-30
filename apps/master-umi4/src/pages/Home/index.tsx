import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Row, Modal, Button } from 'antd';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');

  const showModal = () => {
    Modal.warning({
      title: '标题',
      content: '欢迎使用',
    });
  };

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim(name)} />
        <Row justify="center">
          <Button type="primary" onClick={showModal}>
            打开弹窗
          </Button>
        </Row>
      </div>
    </PageContainer>
  );
};

export default HomePage;
