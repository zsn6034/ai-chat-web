import type { ModelConfig } from '@/types/model';
import { Modal, Form, Input, InputNumber } from 'antd';

interface ConfigDialogProps {
  open: boolean;
  initValues: ModelConfig;
  onCancel: () => void;
  onOk: (values: ModelConfig) => void;
}

const ConfigDialog = ({
  open,
  initValues,
  onCancel,
  onOk,
}: ConfigDialogProps) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values);
      })
      .catch((info) => {
        console.error('Validate Failed:', info);
      });
  };

  return (
    <Modal title="配置参数" open={open} onCancel={onCancel} onOk={handleOk}>
      <Form form={form} layout="vertical" initialValues={initValues}>
        <Form.Item
          name="apikey"
          label="apikey"
          rules={[{ required: true, message: '请输入火山引擎apikey' }]}
        >
          <Input placeholder="请输入火山引擎apikey" />
        </Form.Item>

        <Form.Item
          name="max_tokens"
          label="max_tokens"
          rules={[{ required: true, message: '请输入max_tokens' }]}
        >
          <InputNumber
            min={1024}
            max={128000}
            style={{ width: '100%' }}
            placeholder="请输入max_tokens"
          />
        </Form.Item>

        <Form.Item
          name="temperature"
          label="temperature"
          rules={[{ required: true, message: '请输入temperature' }]}
        >
          <InputNumber
            min={0}
            max={2}
            step={0.1}
            style={{ width: '100%' }}
            placeholder="请输入temperature"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ConfigDialog;
