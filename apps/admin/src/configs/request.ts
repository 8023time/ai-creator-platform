import axios from 'axios';
import { message } from 'antd';
import errCode from '@/configs/errorCode';

const http = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

http.interceptors.request.use(
  (config) => config,
  (error) => {
    message.error('请求发送失败');
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    const { data } = response;

    if (data?.success) {
      return data;
    }

    message.error(data?.message || '请求失败');
    return Promise.reject(data);
  },
  (error) => {
    if (!error.response) {
      message.error('网络连接失败，请检查网络');
      return Promise.reject(new Error('网络连接失败'));
    }

    const status = error.response?.status;
    const msg = status !== undefined ? (errCode as Record<number, string>)[status] : errCode.default;
    message.error(msg ?? errCode.default);

    return Promise.reject(error);
  },
);

export default http;
