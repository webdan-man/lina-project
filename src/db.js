import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
  storage:
    '++id, key, *images, name, cost, number, price, description, link, createdAt, updatedAt, deletedAt, archivedAt',
  orders:
    '++id, key, customer, *products, payment, paymentValue, image, archive, createdAt, updatedAt, deletedAt, archivedAt, confirmDescription, orderDate, description'
});
