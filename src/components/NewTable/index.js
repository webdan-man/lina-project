import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Input, Table } from 'antd';
import PropTypes from 'prop-types';
const EditableContext = React.createContext(null);
import { EditOutlined } from '@ant-design/icons';

const EditableRow = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
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
      [dataIndex]: record[dataIndex]
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave?.({
        ...record,
        ...values
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
          width: 'auto'
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`
          }
        ]}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}>
        {children} <EditOutlined />
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

EditableCell.propTypes = {
  title: PropTypes.string,
  editable: PropTypes.bool,
  children: PropTypes.node,
  dataIndex: PropTypes.string,
  record: PropTypes.any,
  handleSave: PropTypes.func
};

const NewTable = ({ dataSource, defaultColumns = [], history = false, addButton, handleSave }) => {
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  };

  let columns = [...defaultColumns];

  if (!history) {
    columns = defaultColumns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave
        })
      };
    });
  }

  return (
    <div>
      {addButton?.()}
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};

NewTable.propTypes = {
  dataSource: PropTypes.any,
  handleSave: PropTypes.func,
  defaultColumns: PropTypes.array,
  history: PropTypes.bool,
  addButton: PropTypes.func
};

export default NewTable;
