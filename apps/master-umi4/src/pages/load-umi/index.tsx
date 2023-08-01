// prettier-ignore
import { customFetch } from '@/utils/helper';
import { PageContainer } from '@ant-design/pro-components';
import { MicroApp } from '@umijs/max';
import { Divider, Modal, Typography } from 'antd';
import {
  loadMicroApp,
  initGlobalState,
  registerMicroApps, // 注册子应用
  setDefaultMountApp, // 设置默认进入的子应用
  start, // 启动应用
  runAfterFirstMounted,
} from 'qiankun';

import React, { useEffect, useRef, useState } from 'react';

const { Title, Text, Paragraph } = Typography;

let microApp: any = null;


// 两个 umi 应用，分以下情况
// 同时使用 hash 路由
// 同时使用 history 路由
// 同时使用 hash、history 两种路由
const LoadMicroApp: React.FC = () => {
  const [replyMessage, setReplyMessage] = useState('');

  const containerRef = useRef(null);

  const handleOk = (type: number) => {
    if (type === 2) {
      setReplyMessage("you're welcome");
    } else {
      microApp.update({
        base: '/',
        replyMessage: "you're welcome",
        message: 'hello sub-app-3, load as loadMicroApp function',
        callback: (message: string) => callback(message, 3),
      });
    }
  };

  const callback = (message: string, type: number) => {
    Modal.success({
      title: `来自微应用 sub-app-${type}的信息`,
      content: message,
      okText: "reply you're welcome",
      onOk: () => handleOk(type),
    });
  };

  useEffect(() => {
    if (containerRef.current) {
      microApp = loadMicroApp(
        {
          name: 'slave-umi4',
          entry: '//localhost:6001',
          container: containerRef.current,
          props: {
            base: '/',
            message: 'hello sub-app-3, load as loadMicroApp function',
            callback: (message: string) => callback(message, 3),
          },
        },
        {
          // @ts-ignore
          fetch: customFetch,
        },
      );
    }
    return () => {
      microApp?.unmount();
      microApp = null;
    };
  }, [containerRef.current]);

  return (
    <PageContainer ghost title={'挂载微应用'}>
      <p>TODO: Link 样式相互干扰了</p>
      <Typography>
        <ul>
          <li>
            <Title level={5}>微应用(slave-umi3)</Title>
            <Text>基于umi-MicroApp组件</Text>
            <div style={{ border: 'solid 1px #cecece' }}>
              <MicroApp
                name="slave-umi3"
                message={'hello slave-umi3, load as umi-MicroApp component'}
                replyMessage={replyMessage}
                callback={(message: string) => callback(message, 2)}
              />
            </div>
            <Divider />
          </li>
          <li>
            <Title level={5}>路由微应用(slave-umi4)</Title>
            <Text>基于qiankun-loadMicroApp方法</Text>
            <div style={{ border: 'solid 1px #cecece' }} ref={containerRef} />
          </li>
        </ul>
      </Typography>
    </PageContainer>
  );
};

export default LoadMicroApp;
