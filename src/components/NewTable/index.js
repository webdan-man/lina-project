import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Input, Table, Button } from 'antd';
import PropTypes from 'prop-types';
const EditableContext = React.createContext(null);
import { EditOutlined, PrinterOutlined } from '@ant-design/icons';
import { PDFDownloadLink, Document, Page, Text, View, Font, StyleSheet } from '@react-pdf/renderer';
import { withContext } from '../../contexts/projectContext';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
});

const styles = StyleSheet.create({
  myText: {
    fontFamily: 'Roboto',
    fontSize: 12
  }
});

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

const MyDoc = ({ data }) => {
  return (
    <Document styles={styles}>
      <Page>
        {data.map((row) => (
          <View style={styles.myText}>
            <Text>Customer: {row.customer}</Text>
            <Text>Description: {row.description}</Text>
            <Text>
              Payment: {row.payment} {row.paymentValue}
            </Text>
            <Text> </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

const NewTable = ({
  dataSource,
  defaultColumns = [],
  history = false,
  addButton,
  handleSave,
  downloadButton = false,
  ...props
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(props.orders.filter((order) => newSelectedRowKeys.includes(order.key)));
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const hasSelected = selectedRowKeys.length > 0;
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
        rowSelection={downloadButton ? rowSelection : null}
        size={'middle'}
        bordered={true}
        pagination={false}
        scroll={{
          x: 1500
        }}
      />
      {downloadButton && (
        <PDFDownloadLink
          document={<MyDoc data={selectedRows} />}
          fileName="orders.pdf"
          onClick={(e) => {
            if (!hasSelected) {
              e.preventDefault();
            }
          }}>
          {({ blob, url, loading, error }) =>
            loading ? (
              'Loading document...'
            ) : (
              <Button
                style={{ marginTop: 16 }}
                type="primary"
                icon={<PrinterOutlined />}
                disabled={!hasSelected}>
                Download PDF
              </Button>
            )
          }
        </PDFDownloadLink>
      )}
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

export default withContext(NewTable);
