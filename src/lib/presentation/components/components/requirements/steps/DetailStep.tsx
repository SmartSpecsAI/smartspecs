import { Form, FormInstance, Input } from "antd";

interface DetailsStepProps {
  form: FormInstance<any> | undefined;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({ form }) => (
  <Form form={form} layout="vertical">
    <Form.Item
      name="title"
      label="Title"
      rules={[{ required: true, message: "Please input the title!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      name="description"
      label="Description"
      rules={[{ required: true, message: "Please input the description!" }]}
    >
      <Input.TextArea rows={4} />
    </Form.Item>

    <Form.Item
      name="clientRepName"
      label="Client Representative"
      rules={[
        {
          required: true,
          message: "Please input the client representative name!",
        },
      ]}
    >
      <Input />
    </Form.Item>
  </Form>
);
