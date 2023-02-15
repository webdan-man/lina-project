import React, { useState } from 'react';
import { Button, Image, Modal } from 'antd';
import NewTable from '../../components/NewTable';
import { UploadOutlined } from '@ant-design/icons';
import { withContext } from '../../contexts/projectContext';
import { db } from '../../db';

const History = (props) => {
  console.log('here props', props);
  const restore = async (record) => {
    const restoreItem = { ...record };

    delete restoreItem.key;
    delete restoreItem.archivedAt;
    await db.orders.put({ ...restoreItem });
  };

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const defaultColumns = [
    {
      title: 'Customer',
      dataIndex: 'customer'
    },
    {
      title: 'Description',
      dataIndex: 'description'
    },
    {
      title: 'Products',
      dataIndex: 'products',
      render: (products) =>
        products.map((product) => `${product.first} (${product.number})`).join(', ')
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      render: (payment, record) =>
        payment + (record.paymentValue ? ` (${record.paymentValue})` : '')
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (src) => <Image width={60} src={src} />
    },
    {
      title: 'Confirm description',
      dataIndex: 'confirmDescription'
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" icon={<UploadOutlined />} onClick={showModal}>
            Restore
          </Button>
          <Modal
            title="Warning"
            open={open}
            onOk={() => {
              restore(record);
              hideModal();
            }}
            onCancel={hideModal}
            okText="Yes"
            cancelText="Cancel">
            Do you Want to restore this item?
          </Modal>
        </>
      )
    }
  ];

  return (
    <NewTable dataSource={props.archiveOrders} defaultColumns={defaultColumns} history={true} />
  );
};

export default withContext(History);