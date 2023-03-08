import React, { useState } from 'react';
import { Button, Image, Modal } from 'antd';
import NewTable from '../../components/NewTable';
import { MinusOutlined, UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { withContext } from '../../contexts/projectContext';
import { doc, updateDoc } from 'firebase/firestore';
import firestore from '../../firebase';

const History = (props) => {
  const restore = async (record) => {
    const restoreItem = { ...record };

    restoreItem.key = null;
    restoreItem.archivedAt = null;

    await updateDoc(doc(firestore, 'orders', restoreItem.id), { ...restoreItem });
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
      dataIndex: 'customer',
      fixed: 'left'
    },
    {
      title: 'Description',
      dataIndex: 'description'
    },
    {
      title: 'Products',
      dataIndex: 'products',
      render: (products) => {
        if (!products) return <MinusOutlined />;

        return products
          .map(
            (product) =>
              `${props.storage.find((item) => item.id === product.id)?.name} (${product.number})`
          )
          .join(', ');
      }
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      render: (payment, record) =>
        payment + (record.paymentValue ? ` (${record.paymentValue})` : '')
    },
    {
      title: 'Confirm Image',
      dataIndex: 'image',
      render: (src) => <Image width={60} height={60} src={src} />
    },
    {
      title: 'Confirm description',
      dataIndex: 'confirmDescription',
      render: (confirmDescription) =>
        confirmDescription || <CheckCircleOutlined style={{ color: '#3f8600', fontSize: 20 }} />
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
