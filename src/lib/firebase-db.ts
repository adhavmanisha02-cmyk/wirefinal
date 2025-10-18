import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  addDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'cod' | 'online' | 'qr';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentProof?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inquiry {
  id: string;
  userId?: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  userType: 'individual' | 'business';
  productName: string;
  quantity: number;
  location: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTIONS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  INQUIRIES: 'inquiries',
  USERS: 'users',
  PAYMENT_SETTINGS: 'payment_settings'
};

export const productsDB = {
  async getAll(): Promise<Product[]> {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.PRODUCTS), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Product));
  },

  async getById(id: string): Promise<Product | null> {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      } as Product;
    }
    return null;
  },

  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Product>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
  },

  onSnapshot(callback: (products: Product[]) => void) {
    return onSnapshot(
      query(collection(db, COLLECTIONS.PRODUCTS), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        } as Product));
        callback(products);
      }
    );
  }
};

export const ordersDB = {
  async getAll(): Promise<Order[]> {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Order));
  },

  async getByUserId(userId: string): Promise<Order[]> {
    const q = query(
      collection(db, COLLECTIONS.ORDERS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Order));
  },

  async getById(id: string): Promise<Order | null> {
    const docRef = doc(db, COLLECTIONS.ORDERS, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      } as Order;
    }
    return null;
  },

  async create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Order>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.ORDERS, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.ORDERS, id));
  },

  onSnapshot(callback: (orders: Order[]) => void) {
    return onSnapshot(
      query(collection(db, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        } as Order));
        callback(orders);
      }
    );
  },

  onUserOrdersSnapshot(userId: string, callback: (orders: Order[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.ORDERS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as Order));
      callback(orders);
    });
  }
};

export const inquiriesDB = {
  async getAll(): Promise<Inquiry[]> {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.INQUIRIES), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    } as Inquiry));
  },

  async getByUserId(userId: string): Promise<Inquiry[]> {
    const q = query(
      collection(db, COLLECTIONS.INQUIRIES),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    } as Inquiry));
  },

  async create(inquiry: Omit<Inquiry, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.INQUIRIES), {
      ...inquiry,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Inquiry>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.INQUIRIES, id);
    await updateDoc(docRef, updates);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.INQUIRIES, id));
  },

  onSnapshot(callback: (inquiries: Inquiry[]) => void) {
    return onSnapshot(
      query(collection(db, COLLECTIONS.INQUIRIES), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const inquiries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        } as Inquiry));
        callback(inquiries);
      }
    );
  }
};

export const usersDB = {
  async getById(id: string): Promise<UserProfile | null> {
    const docRef = doc(db, COLLECTIONS.USERS, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      } as UserProfile;
    }
    return null;
  },

  async getByPhone(phone: string): Promise<UserProfile | null> {
    const q = query(
      collection(db, COLLECTIONS.USERS),
      where('phone', '==', phone)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as UserProfile;
    }
    return null;
  },

  async create(userId: string, profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    await setDoc(doc(db, COLLECTIONS.USERS, userId), {
      ...profile,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  },

  async update(id: string, updates: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }
};

export const paymentSettingsDB = {
  async get(): Promise<{ qrCodeUrl: string; upiId: string } | null> {
    const docRef = doc(db, COLLECTIONS.PAYMENT_SETTINGS, 'default');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as { qrCodeUrl: string; upiId: string };
    }
    return null;
  },

  async set(qrCodeUrl: string, upiId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PAYMENT_SETTINGS, 'default');
    await setDoc(docRef, { qrCodeUrl, upiId });
  }
};
