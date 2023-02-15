import React from 'react';
import { Card, Col, Row, Statistic, Space } from 'antd';
import { withContext } from '../../contexts/projectContext';

const Dashboard = (props) => {
  return (
    <Space direction={'vertical'} style={{ width: '100%' }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic title="Storage" value={props.storage.length} />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Orders"
              value={props.orders.length}
              suffix={`/${props.allOrders.length}`}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default withContext(Dashboard);
