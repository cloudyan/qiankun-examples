import { history } from '@umijs/max';
import { Button, Result } from 'antd';

interface ErrorProps {
  info: ErrorInfo;
}

interface ErrorInfo {
  status: number;
  title?: string;
  subTitle?: string;
}

export default function CustomErrorBoundary(props: ErrorProps) {
  const handleClick = () => {
    history.push('/home');
  };

  const info = props.info || {};
  let status: any = info.status || 500
  let title = info.title || '500'
  let subTitle = info.subTitle || 'Sorry, something went wrong.';

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
