import React, { useState } from 'react';
import NewTable from '../../components/NewTable';
import { Image, Typography } from 'antd';
import AddButton from './AddButton';
import ActionButtons from '../../components/ActionButtons';
import { withContext } from '../../contexts/projectContext';
import { MinusOutlined } from '@ant-design/icons';
import IamgeGalery from '../../components/IamgeGalery';
import { doc, updateDoc } from 'firebase/firestore';
import firestore from '../../firebase';

const { Link } = Typography;

const Storage = (props) => {
  const defaultColumns = [
    {
      title: 'Image',
      dataIndex: 'images',
      render: (images) => <IamgeGalery images={images} />,
      fixed: 'left'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      fixed: 'left'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      editable: true
    },
    {
      title: 'Number',
      dataIndex: 'number',
      editable: true
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      editable: true,
      render: (cost) => `${cost} грн`
    },
    {
      title: 'Price',
      dataIndex: 'price',
      editable: true,
      render: (price) => `${price} грн`
    },
    {
      title: 'Link',
      dataIndex: 'link',
      render: (link) =>
        link ? (
          <Link href={link} target="_blank">
            visit shop
          </Link>
        ) : (
          <MinusOutlined />
        )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => <ActionButtons record={record} type={'storage'} />,
      width: 100
    }
  ];

  const handleSave = async (row) => {
    await updateDoc(doc(firestore, 'storage', row.id), { ...row });
  };

  return (
    <NewTable
      dataSource={props.storage}
      handleSave={handleSave}
      defaultColumns={defaultColumns}
      addButton={() => <AddButton />}
    />
  );
};

export default withContext(Storage);
