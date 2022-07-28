/// <reference types="styled-jsx" />
import type { AppProps } from 'next/app';
import { message } from 'antd';
import Moment from 'moment';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import locale from 'moment/locale/es';
import 'styles/globals.css';
import 'styles/Layout.css';

message.config({
  top: 24,
  duration: 3,
  getContainer: () => document.body,
});

Moment.updateLocale('es', locale);

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
