import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Row, Modal, Button, App } from 'antd';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  // 若要使用 useApp hook，须先在 antd 插件中配置 appConfig
  const { message, modal } = App.useApp();

  const showModal = () => {
    // 这里不使用 Modal, 使用 modal
    modal.warning({
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
