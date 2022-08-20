/// <reference types="styled-jsx" />
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from 'store';
import { ConfigProvider, message } from 'antd';
import Moment from 'moment';
// @ts-ignore
import locale from 'moment/locale/es';
import 'styles/globals.css';
import 'styles/Layout.css';
import 'styles/HomeMap.css';

message.config({
  top: 0,
  duration: 3,
  getContainer: () => document.body,
});

Moment.updateLocale('es', locale);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ConfigProvider>
  );
}

export default MyApp;
