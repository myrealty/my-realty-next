/* eslint-disable no-unused-vars */
import { SetStateAction, Dispatch } from 'react';
import { message } from 'antd';
import { AxiosResponse } from 'axios';

export enum MessageTypes {
  warning = 'warning',
  warn = 'warn',
  error = 'error',
  err = 'error',
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

const calcDuration = (msg = '') => msg.split(' ').length / 2;

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
        message[type](msg, Math.max(...[3, calcDuration(msg)]));
      });
      return;
    }
    message[type](
      response.message,
      Math.max(...[3, calcDuration(response.message)])
    );
    return;
  }

  // Checking if error is due to offline
  if (
    error.message === 'Network Error' ||
    error.message === 'Failed to fetch'
  ) {
    if (document.querySelector('.ant-message > div')?.children.length) return;
    if (!navigator.onLine) {
      message[type](
        'La petición no puede ser realizada. Verifique su conexión a internet.',
        5
      );
      return;
    }
    message[type]('Error: no se puede establecer la conexión', 20);
  }
};

export const handleSuccess = (
  response: AxiosResponse | undefined,
  defaultMessage = ''
): void => {
  const msg = response?.data?.message || defaultMessage;
  // Validating that have a response or default message
  if (msg) {
    message.info(msg);
    return;
  }
  // Validating that does not have a message if is development enviroment
  if (process.env.NODE_ENV === 'development') {
    message.error('Message not provided');
  }
};

const handlers = {
  handleError,
  handleSuccess,
};

export default handlers;
