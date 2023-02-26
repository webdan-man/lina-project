import React, { useState } from 'react';
import { Image } from 'antd';
import { MinusOutlined } from '@ant-design/icons';

const IamgeGalery = ({ images }) => {
  const [visible, setVisible] = useState(false);

  if (!Array.isArray(images)) {
    return <MinusOutlined />;
  }

  return (
    <>
      <Image
        preview={{
          visible: false
        }}
        width={60}
        height={60}
        src={images[0]}
        onClick={() => setVisible(true)}
      />
      <div
        style={{
          display: 'none'
        }}>
        <Image.PreviewGroup
          preview={{
            visible,
            onVisibleChange: (vis) => setVisible(vis)
          }}>
          {images.map((src) => (
            <Image width={60} height={60} src={src} />
          ))}
        </Image.PreviewGroup>
      </div>
    </>
  );
};

export default IamgeGalery;
