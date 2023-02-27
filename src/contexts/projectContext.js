import React, { createContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

const Context = createContext();

const Provider = ({ children }) => {
  const storageFromDB = useLiveQuery(() => db.storage.toArray());
  const allOrdersFromDB = useLiveQuery(() => db.orders.toArray());

  const storage = useMemo(
    () => storageFromDB?.map((item) => ({ ...item, key: item.id })) || [],
    [storageFromDB]
  );

  const orders = useMemo(
    () =>
      allOrdersFromDB
        ?.filter((item) => !item.archivedAt)
        .map((item) => ({ ...item, key: item.id })) || [],
    [allOrdersFromDB]
  );

  const allOrders = useMemo(
    () => allOrdersFromDB?.map((item) => ({ ...item, key: item.id })) || [],
    [allOrdersFromDB]
  );

  const archiveOrders = useMemo(
    () =>
      allOrdersFromDB
        ?.filter((item) => item.archivedAt)
        .map((item) => ({ ...item, key: item.id })) || [],
    [allOrdersFromDB]
  );

  return (
    <Context.Provider
      value={{
        storage,
        orders,
        allOrders,
        archiveOrders
      }}>
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.node
};

const withContext = (Child) => (props) =>
  <Context.Consumer>{(context) => <Child {...props} {...context} />}</Context.Consumer>;

export { Provider, withContext };
