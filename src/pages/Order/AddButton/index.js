import React, { useCallback, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Radio,
  Typography,
  DatePicker,
  InputNumber
} from 'antd';
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

  const products = Form.useWatch('products', form) || [];

  const filterStorage = useMemo(
    () =>
      props.storage.map((product) => ({
        ...product,
        disabled: products.map((item) => item?.id).includes(product.id)
      })),
    [props.storage, products]
  );

  const getMaxNumber = useCallback(
    (key) =>
      props.storage.find((product) => product.id === products[key]?.id)?.number ||
      (100)[props.storage]
  );

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
                    align="start">
                    <Form.Item
                      {...restField}
                      name={[name, 'id']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing product'
                        }
                      ]}>
                      <Select
                        style={{ width: 300 }}
                        placeholder="select one product"
                        optionLabelProp="label"
                        showSearch
                        allowClear>
                        {filterStorage.map((product) => (
                          <Option
                            disabled={product.disabled}
                            value={product.id}
                            label={product.name}>
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
                      <InputNumber
                        placeholder="Number"
                        style={{ width: '100%' }}
                        max={getMaxNumber(key)}
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} style={{ marginTop: 8 }} />
                  </Space>
                ))}
                {!!filterStorage?.length ? (
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
        <Form.Item label="Order Date" name="orderDate">
          <DatePicker />
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
          <InputNumber style={{ width: '100%' }} />
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
    await Promise.all(
      data.products.map(async (product) => {
        const productItem = await db.storage.get({ id: product.id });
        return await db.storage.update(product.id, { number: productItem.number - product.number });
      })
    );
    await db.orders.add({ ...data, orderDate: data.orderDate.format('YYYY-MM-DD') });
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
