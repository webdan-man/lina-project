import { Button, Form, Input, Modal, Upload, InputNumber } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { collection, addDoc } from 'firebase/firestore';
import firestore from '../../../firebase';

const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
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

  return (
    <Modal
      open={open}
      destroyOnClose={true}
      title="Add new product"
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
        <Form.Item label="Image">
          <Form.Item name="images" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
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
              onPreview={onPreview}
              multiple={true}>
              {fileList.length < 5 && '+ Upload'}
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
        <Form.Item required name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item initialValue={null} name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item required name="cost" label="Cost">
          <InputNumber addonAfter="грн" />
        </Form.Item>
        <Form.Item required name="number" label="Number">
          <InputNumber />
        </Form.Item>
        <Form.Item required name="price" label="Price" type="number">
          <InputNumber addonAfter="грн" />
        </Form.Item>
        <Form.Item initialValue={null} name="link" label="Link product">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

CollectionCreateForm.propTypes = {
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
  open: PropTypes.bool
};

const AddButton = () => {
  const handleAdd = async (data) => {
    const images = data.images
      ? await Promise.all(
          data.images.map(
            (file) =>
              new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
              })
          )
        )
      : null;

    await addDoc(collection(firestore, 'storage'), { ...data, images: images });
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
        <PlusOutlined /> New Product
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
