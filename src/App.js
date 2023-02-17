import React, { useState } from 'react';
import { Layout, Space, Menu, Avatar } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { Link, Routes, Route, useLocation } from 'react-router-dom';

import {
  ShopOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import Storage from './pages/Storage';
import Order from './pages/Order';
import History from './pages/History';

const App = () => {
  let location = useLocation();

  const [menuItemActive, setMenuItemActive] = useState('');

  React.useEffect(() => {
    setMenuItemActive(location.pathname);
  }, [location]);

  const items = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>
    },
    {
      key: '/storage',
      icon: <ShopOutlined />,
      label: <Link to="/storage">Storage</Link>
    },
    {
      key: '/order',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/order">Order</Link>
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: <Link to="/history">History</Link>
    }
  ];

  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
        height: '100vh'
      }}
      size={[0, 48]}>
      <Layout hasSider>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0
          }}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              height: 64
            }}>
            <Avatar size={60} src={<img src={'logo.jpeg'} alt="Stickers and HairBands Shop" />} />
          </div>
          <Menu
            style={{ marginTop: 10 }}
            theme="dark"
            mode="inline"
            selectedKeys={[menuItemActive]}
            items={items}
          />
        </Sider>
        <Layout
          style={{
            marginLeft: 200
          }}>
          <Header>Header</Header>
          <Content style={{ minHeight: 'calc(100vh - 129px)', padding: 24 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/storage" element={<Storage />} />
              <Route path="/order" element={<Order />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </Space>
  );
};

export default App;
