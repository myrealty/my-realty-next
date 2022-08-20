import React, { useState } from 'react';
// helpers
import { handleError, MessageTypes, calcDuration } from 'helpers/handlers';
// http functions
import { postContactAgent } from 'api/listing';
// store
import { useSelector } from 'react-redux';
import { AppState } from 'store';
// styles
import { Modal, Button, Form, Input, Spin, message } from 'antd';

export default function ContactAgentModal({
  setShowContactAgentModal,
}: {
  setShowContactAgentModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { appLocation } = useSelector((state: AppState) => state.app);
  const { address, road, postcode, city, state, country, listingId } =
    appLocation!;
  const [loading, setLoading] = useState(false);

  const handleOnFinish = async (values: {
    name: string;
    phone: string;
    email: string;
    message: string;
  }) => {
    setLoading(true);
    try {
      const { data } = await postContactAgent({ data: values, id: listingId });
      message.success({
        content: data.message,
        duration: Math.max(...[3, calcDuration(data.message)]),
      });
    } catch (err: any) {
      handleError({ err, type: MessageTypes.error });
    }
    setLoading(false);
    setShowContactAgentModal(false);
  };

  return (
    <Modal
      title={
        <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>
          Contactar Agente
        </h2>
      }
      centered
      width="75vw"
      style={{ maxWidth: '1200px', top: '0', zIndex: '3000' }}
      bodyStyle={{ overflowY: 'scroll', height: '70vh' }}
      visible={true}
      footer={null}
      onCancel={() => setShowContactAgentModal(false)}
    >
      <Spin tip="Enviando..." spinning={loading}>
        <Form
          initialValues={{
            message: `Estoy interesado en la propiedad: ${
              address?.length ? address + ',' : ''
            } ${road?.length ? road + ',' : ''} ${
              postcode?.length ? postcode + ',' : ''
            } ${city?.length ? city + ',' : ''} ${
              state?.length ? state + ',' : ''
            } ${country?.length ? country : ''}`,
          }}
          layout="vertical"
          scrollToFirstError
          onFinish={handleOnFinish}
        >
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              {
                max: 100,
                required: true,
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Teléfono"
            name="phone"
            rules={[
              {
                max: 100,
                required: true,
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Correo"
            name="email"
            rules={[
              {
                required: true,
                type: 'email',
                max: 100,
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Mensaje"
            name="message"
            rules={[
              {
                required: true,
                type: 'string',
                max: 200,
              },
            ]}
          >
            <Input.TextArea style={{ resize: 'none', overflow: 'auto' }} />
          </Form.Item>
          <Button loading={loading} htmlType="submit" type="primary" block>
            Contactar Agente
          </Button>
        </Form>
      </Spin>
    </Modal>
  );
}
