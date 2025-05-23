import { Form, FormInstance, Input, Select } from "antd";
import { Project } from "@/smartspecs/lib/domain";

interface DetailsStepProps {
  form: FormInstance<any> | undefined;
  project: Project | null;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({ form, project }) => (
  <Form form={form} layout="vertical">
    <Form.Item
      name="title"
      label="Title"
      rules={[{ required: true, message: "Please input the title!" }]}
    >
      <Input.TextArea rows={3} style={{ minHeight: "70px" }} />
    </Form.Item>

    <Form.Item
      name="description"
      label="Description"
      rules={[{ required: true, message: "Please input the description!" }]}
    >
      <Input.TextArea rows={5} style={{ minHeight: "100px" }} />
    </Form.Item>

    <Form.Item
      name="clientRepName"
      label="Client Representative"
      rules={[
        {
          required: true,
          message: "Please select a client representative!",
        },
      ]}
    >
      <Select
        placeholder="Select a representative"
        options={project?.representatives?.map((rep: { name: string }) => ({
          label: rep.name,
          value: rep.name,
        }))}
      />
    </Form.Item>
  </Form>
);
