import React, { useMemo } from 'react';
import { Card, Space, Image, Badge, Divider, Calendar, Row, Col, Statistic, Tooltip } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { withContext } from '../../contexts/projectContext';
import dayjs from 'dayjs';

import './index.css';

const Dashboard = (props) => {
  const getListData = (value) => {
    let listData;

    const currentOrders = props.allOrders.filter(
      (order) => order.orderDate === value.format('YYYY-MM-DD')
    );

    if (currentOrders.length) {
      if (dayjs().isAfter(value, 'day')) {
        listData = currentOrders.map((order) => ({
          ...order,
          type: order.archivedAt ? 'success' : 'error'
        }));
      }
      if (dayjs().isBefore(value, 'day')) {
        listData = currentOrders.map((order) => ({ ...order, type: 'processing' }));
      }
      if (dayjs().isSame(value, 'day')) {
        listData = currentOrders.map((order) => ({ ...order, type: 'warning' }));
      }
    }
    return listData || [];
  };

  // const getMonthData = (value) => {
  //   if (value.month() === 8) {
  //     return 1394;
  //   }
  // };
  //
  // const monthCellRender = (value) => {
  //   const num = getMonthData(value);
  //   return num ? (
  //     <div className="notes-month">
  //       <section>{num}</section>
  //     </div>
  //   ) : null;
  // };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.id}>
            <Tooltip
              title={
                <Space direction={'vertical'}>
                  <span>{item.description}</span>
                  <span>{item.payment}</span>
                </Space>
              }>
              <Badge status={item.type} text={item.customer} />
            </Tooltip>
          </li>
        ))}
      </ul>
    );
  };

  const totalCost = useMemo(() => {
    return props.storage.reduce(
      (sum, product) => sum + (product.cost || 0) * (product.number || 0),
      0
    );
  }, [props.storage]);

  const profit = useMemo(() => {
    const totalPrice = props.storage.reduce(
      (sum, product) => sum + (product.price || 0) * (product.number || 0),
      0
    );

    return totalPrice - totalCost;
  }, [props.storage, totalCost]);

  const totalOrdersCost = useMemo(() => {
    return props.orders.reduce(
      (ordersSum, order) =>
        ordersSum +
        order.products.reduce(
          (productsSum, product) =>
            productsSum +
            (props.storage.find((item) => item.id === product.id)?.cost || 0) *
              (product.number || 0),
          0
        ),
      0
    );
  }, [props.storage]);

  const totalOrdersProfit = useMemo(() => {
    const totalOrdersPrice = props.orders.reduce(
      (ordersSum, order) =>
        ordersSum +
        order.products.reduce(
          (productsSum, product) =>
            productsSum +
            (props.storage.find((item) => item.id === product.id)?.price || 0) *
              (product.number || 0),
          0
        ),
      0
    );

    return totalOrdersPrice - totalOrdersCost;
  }, [props.storage, totalOrdersCost]);

  return (
    <Space direction={'vertical'} style={{ width: '100%' }}>
      <Row gutter={16}>
        <Col span={16}>
          <Card bordered={false}>
            <Space split={<Divider type="vertical" />} wrap>
              {props.storage.map((product) => (
                <Space direction={'vertical'}>
                  {/*<span>{product.name}</span>*/}
                  <Badge count={product.number} showZero>
                    <Image width={60} src={product.image} />
                  </Badge>
                </Space>
              ))}
            </Space>
          </Card>
        </Col>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic title="Total Cost" value={totalCost} suffix={`грн`} />
          </Card>
        </Col>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic
              title="Profit"
              value={profit}
              suffix={`грн`}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card bordered={false}>
            <Statistic
              title="Active Orders"
              value={props.orders.length}
              // suffix={`/ ${props.allOrders.length}`}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic title="Total Orders Cost" value={totalOrdersCost} suffix={`грн`} />
          </Card>
        </Col>
        <Col span={4}>
          <Card bordered={false}>
            <Statistic
              title="Total Orders Profit"
              value={totalOrdersProfit}
              suffix={`грн`}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Calendar
        dateCellRender={dateCellRender}
        // monthCellRender={monthCellRender}
      />
    </Space>
  );
};

export default withContext(Dashboard);
