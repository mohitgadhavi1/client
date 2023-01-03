import { Form, Input, Popconfirm, Select, DatePicker } from "antd";
import React, { useContext, useRef, useState, useEffect } from "react";
import dayjs from "dayjs";
const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        {<Input ref={inputRef} onPressEnter={save} onBlur={save} />}
      </Form.Item>
    ) : dataIndex === "packetType" ? (
      <Form.Item
        name={dataIndex}
        initialValue={record.packetType}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
        style={{ width: 100, margin: 0 }}
      >
        <Select
          onBlur={save}
          ref={inputRef}

          // onChange={handleChange}
        >
          <Select.Option value="Food">Food</Select.Option>
          <Select.Option value="Water">Water</Select.Option>
        </Select>
      </Form.Item>
    ) : dataIndex === "expiry_date" ? (
      // <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      <Form.Item
        name={dataIndex}
        initialValue={record?.expiry_date || dayjs()}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
        style={{ margin: 0 }}
      >
        <DatePicker ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          height: 30,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
