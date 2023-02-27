import React, { useState } from 'react';
import { Button, Dropdown, Form, Image, Input, Modal, Upload } from 'antd';
import {
  CheckOutlined,
  CopyOutlined,
  DeleteOutlined,
  MenuOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { withContext } from '../../contexts/projectContext';
import { db } from '../../db';

const ActionButtons = ({ record, type, confirmButton = false, ...props }) => {
  const handleDelete = async (id) => {
    if (type === 'orders') {
      const deleteOrder = await db[type].get({ id });

      const productsFromStorage = await Promise.all(
        deleteOrder.products.map(({ id }) => db.storage.get({ id }))
      );

      productsFromStorage.forEach((product) => {
        const tempProduct = { ...product };

        tempProduct.number = deleteOrder.products.find((item) => item.id === product.id).number;

        db.storage.put(tempProduct);
      });
    }

    await db[type].delete(id);
  };

  const handleCopy = async (record) => {
    delete record.id;
    delete record.key;
    await db[type].add(record);
  };

  const onConfirm = async (record, data) => {
    const file = data.image[0];

    const src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => resolve(reader.result);
    });
    await db[type].put({ ...record, ...data, image: src, archivedAt: Date.now() });
  };

  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const showModalConfirm = () => {
    setOpenConfirm(true);
  };

  const hideModalConfirm = () => {
    setOpenConfirm(false);
  };

  let items = [
    {
      label: (
        <>
          <Button type="link" icon={<DeleteOutlined />} onClick={showModal}>
            Delete
          </Button>
          <Modal
            title="Warning"
            open={open}
            onOk={() => {
              handleDelete(record.id);
              hideModal();
            }}
            onCancel={hideModal}
            okText="Yes"
            cancelText="Cancel">
            Do you Want to delete this item?
          </Modal>
        </>
      ),
      key: '0'
    },
    {
      label: (
        <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(record)}>
          Copy
        </Button>
      ),
      key: '1'
    }
  ];

  const [form] = Form.useForm();

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;

    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  if (confirmButton) {
    items = [
      ...items,
      {
        label: (
          <>
            <Button type="link" icon={<CheckOutlined />} onClick={showModalConfirm}>
              Confirm
            </Button>
            <Modal
              open={openConfirm}
              title="Confirm Order"
              okText="Confirm"
              cancelText="Cancel"
              onOk={() => {
                form
                  .validateFields()
                  .then((values) => {
                    form.resetFields();
                    onConfirm(record, values);
                  })
                  .catch((info) => {
                    console.log('Validate Failed:', info);
                  });
                hideModalConfirm();
              }}
              onCancel={hideModalConfirm}>
              <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                  modifier: 'public'
                }}>
                <Form.Item label="Image">
                  <Form.Item
                    name="image"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle>
                    <Upload.Dragger
                      name="files"
                      customRequest={({ file, onSuccess }) => {
                        setTimeout(() => {
                          onSuccess('ok');
                        }, 0);
                      }}
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview}>
                      {fileList.length < 5 && '+ Upload'}
                    </Upload.Dragger>
                  </Form.Item>
                </Form.Item>
                <Form.Item name="confirmDescription" label="Confirm description">
                  <Input type="textarea" />
                </Form.Item>
              </Form>
            </Modal>
          </>
        ),
        key: '2'
      }
    ];
  }

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <MenuOutlined />
    </Dropdown>
  );
};

ActionButtons.propTypes = {
  record: PropTypes.any,
  confirmButton: PropTypes.bool,
  type: PropTypes.string
};

export default withContext(ActionButtons);
