import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export default firestore;
