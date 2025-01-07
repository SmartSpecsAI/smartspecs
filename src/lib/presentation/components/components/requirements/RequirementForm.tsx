import { Form, Input, Select } from "antd";
import { FormInstance } from "antd/lib/form";

interface RequirementFormProps {
  form: FormInstance;
}

export const RequirementForm: React.FC<RequirementFormProps> = ({ form }) => (
  <Form
    form={form}
    layout="vertical"
    initialValues={{
      status: "in_progress",
    }}
  >
    <Form.Item
      name="title"
      label="Title"
      rules={[{ required: true, message: "Please input the title!" }]}
    >
      <Input />
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

    <Form.Item
      name="status"
      label="Status"
      rules={[{ required: true, message: "Please select the status!" }]}
    >
      <Select>
        <Select.Option value="in_progress">In Progress</Select.Option>
        <Select.Option value="approved">Approved</Select.Option>
        <Select.Option value="rejected">Rejected</Select.Option>
      </Select>
    </Form.Item>
  </Form>
);
