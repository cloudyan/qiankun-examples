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

let microApp: any = null;

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
        message: 'hello slave-3, load as loadMicroApp function',
        callback: (message: string) => callback(message, 3),
      });
    }
  };

  const callback = (message: string, type: number) => {
    Modal.success({
      title: `来自微应用 slave-${type}的信息`,
      content: message,
      okText: "reply you're welcome",
      onOk: () => handleOk(type),
    });
  };

  return (
    <>
      {/* <h2>微应用(slave-umi4)</h2>
      <p>基于 umi MicroApp 组件</p> */}
      <MicroApp
        name="slave-umi4"
        message={'hello slave-2, load as umi-MicroApp component'}
        replyMessage={replyMessage}
        callback={(message: string) => callback(message, 2)}
      />
    </>
  );
};

export default LoadMicroApp;
