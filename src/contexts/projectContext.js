import React, { useEffect, createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { collection, onSnapshot } from 'firebase/firestore';

import firestore from '../firebase';

const Context = createContext();

const Provider = ({ children }) => {
  const [storageFromDB, setStorage] = useState([]);
  const [allOrdersFromDB, setOrders] = useState([]);

  // console.log('here storageFromDB', storageFromDB);
  // console.log('here allOrdersFromDB', allOrdersFromDB);

  const subscribeFirestore = (path, set) => {
    return onSnapshot(
      collection(firestore, path),
      (snapshot) => {
        const entities = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          };
        });
        set(entities);
      },
      (error) => {
        console.log('error', error);
      }
    );
  };

  useEffect(() => {
    const unsubscribeStorage = subscribeFirestore('storage', setStorage);
    const unsubscribeOrders = subscribeFirestore('orders', setOrders);

    return () => {
      unsubscribeStorage();
      unsubscribeOrders();
    };
  }, []);

  const storage = useMemo(
    () => storageFromDB?.map((item, index) => ({ ...item, key: index })) || [],
    [storageFromDB]
  );

  const orders = useMemo(
    () =>
      allOrdersFromDB
        ?.filter((item) => !item.archivedAt)
        .map((item, index) => ({ ...item, key: index })) || [],
    [allOrdersFromDB]
  );

  const allOrders = useMemo(
    () => allOrdersFromDB?.map((item, index) => ({ ...item, key: index })) || [],
    [allOrdersFromDB]
  );

  const archiveOrders = useMemo(
    () =>
      allOrdersFromDB
        ?.filter((item) => item.archivedAt)
        .map((item, index) => ({ ...item, key: index })) || [],
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
