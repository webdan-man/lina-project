import React, { useState } from 'react';
import { Button, Form, Image, Input, Modal, Select, Space, Radio, Typography } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { db } from '../../../db';
import { withContext } from '../../../contexts/projectContext';
import { Link } from 'react-router-dom';

const { Option } = Select;
const { Text } = Typography;

const CollectionCreateForm = withContext(({ open, onCreate, onCancel, ...props }) => {
  const [form] = Form.useForm();

  const [value, setValue] = useState(null);
  const onChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <Modal
      open={open}
      title="Add new Order"
      okText="Add"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}>
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public'
        }}>
        <Form.Item name="customer" label="Customer">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item label="Add product">
          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: 'flex',
                      marginBottom: 8
                    }}
                    align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'first']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing first name'
                        }
                      ]}>
                      <Select
                        style={{ width: 300 }}
                        placeholder="select one product"
                        optionLabelProp="label"
                        showSearch>
                        {props.storage?.map((product) => (
                          <Option value={product.id} label={product.name}>
                            <Space>
                              <span role="img" aria-label={product.name}>
                                <Image preview={false} width={15} src={product.image} />
                              </span>
                              {`${product.name} (${product.number})`}
                            </Space>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'number']}>
                      <Input placeholder="Number" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                {props.storage?.length ? (
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Product
                    </Button>
                  </Form.Item>
                ) : (
                  <Space>
                    <Text type="danger">Create Products First</Text>
                    <Link to="/storage">Storage</Link>
                  </Space>
                )}
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item name="payment" label="Payment type">
          <Radio.Group onChange={onChange} value={value}>
            <Space direction="vertical">
              <Radio value={'Оплата при отримані'}>Оплата при отримані</Radio>
              <Radio value={'Завдаток'}>Завдаток</Radio>
              <Radio value={'Оплата повністю'}>Оплата повністю</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="paymentValue" label="Payment Value">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
});

CollectionCreateForm.propTypes = {
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
  open: PropTypes.bool
};

const AddButton = () => {
  const handleAdd = async (data) => {
    const newData = {
      customer: data.customer,
      description: data.description,
      products: data.products,
      payment: data.payment,
      paymentValue: data.paymentValue
    };

    await db.orders.add(newData);
  };
  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    handleAdd(values);
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        type="primary"
        style={{
          marginBottom: 16
        }}>
        <PlusOutlined /> New Order
      </Button>
      <CollectionCreateForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default AddButton;
