import React from 'react';
import NewTable from '../../components/NewTable';
import AddButton from './AddButton';
import ActionButtons from '../../components/ActionButtons';
import { withContext } from '../../contexts/projectContext';
import { Space, Tooltip } from 'antd';
import { db } from '../../db';
import { MinusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const Order = (props) => {
  const defaultColumns = [
    {
      title: 'Customer',
      dataIndex: 'customer',
      editable: true
    },
    {
      title: 'Products',
      dataIndex: 'products',
      render: (products) => {
        if (!products) return <MinusOutlined />;
        return (
          <Space split=",">
            {products.map((product) => {
              const item = props.storage.find((item) => item.id === product.id);

              if (!item) return <MinusOutlined />;

              return (
                <Tooltip title={`На складі ${item.number}`}>
                  <span
                    style={{
                      cursor: 'pointer'
                    }}>{`${item.name} (${product['number']})`}</span>
                </Tooltip>
              );
            })}
          </Space>
        );
      }
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      render: (payment, record) =>
        payment + (record.paymentValue ? ` (${record.paymentValue})` : '')
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      sorter: (a, b) => dayjs(a.orderDate).isAfter(b.orderDate, 'day')
    },
    {
      title: 'Description',
      dataIndex: 'description',
      editable: true
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => <ActionButtons record={record} confirmButton={true} type="orders" />
    }
  ];

  const handleSave = async (row) => {
    const item = await db.orders.get({ id: row.id });
    db.orders.put({
      ...item,
      ...row
    });
  };

  return (
    <NewTable
      dataSource={props.orders}
      defaultColumns={defaultColumns}
      addButton={() => <AddButton />}
      handleSave={handleSave}
      downloadButton={true}
    />
  );
};

export default withContext(Order);
