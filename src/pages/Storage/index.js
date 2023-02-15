import React from 'react';
import NewTable from '../../components/NewTable';
import { Image, Typography } from 'antd';
import AddButton from './AddButton';
import ActionButtons from '../../components/ActionButtons';
import { withContext } from '../../contexts/projectContext';
import { db } from '../../db';
import { MinusOutlined } from '@ant-design/icons';

const { Link } = Typography;

const Storage = (props) => {
  const defaultColumns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (src) => <Image width={60} src={src} />
    },
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true
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
      editable: true
    },
    {
      title: 'Price',
      dataIndex: 'price',
      editable: true
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
      render: (_, record) => <ActionButtons record={record} type={'storage'} />
    }
  ];

  const handleSave = async (row) => {
    const item = await db.storage.get({ id: row.id });
    db.storage.put({
      ...item,
      ...row
    });
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
