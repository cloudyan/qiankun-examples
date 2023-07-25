import { history } from '@umijs/max';
import { Button, Result } from 'antd';

export default function CustomErrorBoundary(props: { error?: any }) {
  const handleClick = () => {
    history.push('/home');
  };

  let status: any = 500,
    title = '500',
    subTitle = 'Sorry, something went wrong.';

  return (
    <Result
      status={status}
      title={title}
      subTitle={subTitle}
      extra={
        <Button type="primary" onClick={handleClick}>
          Back Home
        </Button>
      }
    />
  );
}
