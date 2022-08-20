/* eslint-disable no-unused-vars */
import { SetStateAction, Dispatch } from 'react';
import { message } from 'antd';
import { AxiosResponse } from 'axios';

export enum MessageTypes {
  warning = 'warning',
  warn = 'warn',
  error = 'error',
}

export interface ErrorType {
  response?: AxiosResponse;
  message: string;
}

interface Props {
  err: ErrorType;
  setLoading?: Dispatch<SetStateAction<boolean>>;
  type?: MessageTypes;
}

export const calcDuration = (msg = '') => msg.split(' ').length / 2;

export const handleError = ({
  err: _err,
  setLoading,
  type = MessageTypes.warn,
}: Props): void => {
  const error = _err;
  const response = error.response?.data;
  // stop loading
  if (setLoading) {
    setLoading(false);
  }

  // Checking if error is a response error and have a message
  if (response?.message) {
    if (response?.message instanceof Array) {
      response?.message.forEach((msg: string) => {
        message[type]({
          content: msg,
          duration: Math.max(...[3, calcDuration(msg)]),
        });
      });
      return;
    }
    message[type]({
      content: response.message,
      duration: Math.max(...[3, calcDuration(response.message)]),
    });
    return;
  }

  // Checking if error is due to offline
  if (
    error.message === 'Network Error' ||
    error.message === 'Failed to fetch'
  ) {
    if (document.querySelector('.ant-message > div')?.children.length) return;
    if (!navigator.onLine) {
      const content =
        'La petición no puede ser realizada. Verifique su conexión a internet.';
      message[type]({
        content,
        duration: Math.max(...[3, calcDuration(content)]),
      });
      return;
    }
    const content = 'Error: no se puede establecer la conexión';
    message[type]({
      content,
      duration: Math.max(...[3, calcDuration(content)]),
    });
  }
};

export const handleSuccess = (
  response: AxiosResponse | undefined,
  defaultMessage = ''
): void => {
  const msg = response?.data?.message || defaultMessage;
  // Validating that have a response or default message
  if (msg) {
    message.info({
      content: msg,
      duration: Math.max(...[3, calcDuration(msg)]),
    });
    return;
  }
  // Validating that does not have a message if is development enviroment
  if (process.env.NODE_ENV === 'development') {
    const content = 'Message not provided';
    message.error({
      content,
      duration: Math.max(...[3, calcDuration(content)]),
    });
  }
};

const handlers = {
  handleError,
  handleSuccess,
};

export default handlers;
