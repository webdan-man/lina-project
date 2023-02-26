import React, { useMemo } from 'react';
import { Card, Space, Image, Badge, Divider, Calendar, Row, Col, Statistic, Tooltip } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { withContext } from '../../contexts/projectContext';
import IamgeGalery from '../../components/IamgeGalery';
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
  }, [props.storage, props.orders]);

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
  }, [props.orders, props.storage, totalOrdersCost]);

  const totalDoneOrdersCost = useMemo(
    () =>
      props.archiveOrders.reduce(
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
      ),
    [props.archiveOrders, props.storage]
  );

  const totalDoneProfit = useMemo(() => {
    const totalDoneOrdersPrice = props.archiveOrders.reduce(
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

    return totalDoneOrdersPrice - totalDoneOrdersCost;
  }, [props.archiveOrders, props.storage, totalDoneOrdersCost]);

  const sortedProducts = useMemo(
    () =>
      props.orders
        .map((order) => order.products)
        .flat()
        .reduce((sum, product) => {
          sum[product.id] = {
            number: (sum[product.id] ? sum[product.id].number : 0) + product.number,
            amount: (sum[product.id] ? sum[product.id].amount : 0) + 1
          };

          return sum;
        }, {}),
    [props.orders]
  );

  const sortingProducts = useMemo(
    () =>
      props.storage.sort((a, b) => {
        const productA = sortedProducts[a.id]?.number || 0;
        const productB = sortedProducts[b.id]?.number || 0;
        if (productA > productB) {
          return -1;
        }
        if (productA < productB) {
          return 1;
        }

        return 0;
      }),
    [props.storage]
  );

  return (
    <Space direction={'vertical'} style={{ width: '100%' }}>
      <Card bordered={false} size={'small'}>
        <Space split={<Divider type="vertical" />} wrap>
          {sortingProducts.sort().map((product) => (
            <Tooltip
              color={'magenta'}
              title={
                <Space direction={'vertical'}>
                  <span>{product.name}</span>
                  <span>Всього замовлень: {sortedProducts[product.id]?.amount || 0} рази</span>
                  <span>Замовлено всього: {sortedProducts[product.id]?.number || 0} штук</span>
                </Space>
              }>
              <Space direction={'vertical'}>
                <Badge count={product.number} showZero>
                  <IamgeGalery images={product.images} />
                </Badge>
              </Space>
            </Tooltip>
          ))}
        </Space>
      </Card>
      <Space wrap={true}>
        <Card bordered={false} size={'small'}>
          <Statistic title="Total Storage Cost" value={+totalCost.toFixed(2)} suffix={`грн`} />
        </Card>
        <Card bordered={false} size={'small'}>
          <Statistic
            title="Storage Profit"
            value={+profit.toFixed(2)}
            suffix={`грн`}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
        <Card bordered={false} size={'small'}>
          <Statistic title="Active Orders" value={props.orders.length} />
        </Card>
        <Card bordered={false} size={'small'}>
          <Statistic title="Total Active Orders Cost" value={totalOrdersCost} suffix={`грн`} />
        </Card>
        <Card bordered={false} size={'small'}>
          <Statistic
            title="Total Active Orders Profit"
            value={totalOrdersProfit}
            suffix={`грн`}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
        <Card bordered={false} size={'small'}>
          <Statistic title="Total Done Orders" value={props.archiveOrders.length} />
        </Card>
        <Card bordered={false} size={'small'}>
          <Statistic title="Total Done Orders Cost" value={totalDoneOrdersCost} suffix={`грн`} />
        </Card>
        <Card bordered={false} size={'small'}>
          <Statistic
            title="Total Done Profit"
            value={totalDoneProfit}
            suffix={`грн`}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
      </Space>
      <Calendar
        dateCellRender={dateCellRender}
        // monthCellRender={monthCellRender}
      />
    </Space>
  );
};

export default withContext(Dashboard);
