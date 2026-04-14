import { useState, useEffect } from 'react';
import { Client, Payment, User, Template, CustomVar, Process, Event, Tenant } from './types';
import { useCurrentTenant } from './contexts/TenantContext';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, query, where, getDocFromServer } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';
import { handleFirestoreError, OperationType } from './lib/firestoreError';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState] as const;
}

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    const q = collection(db, 'tenants');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tenant));
      setTenants(data);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'tenants'));
    return () => unsubscribe();
  }, []);

  const addTenant = async (tenant: Omit<Tenant, 'id' | 'createdAt'>) => {
    const id = crypto.randomUUID();
    const newTenant = { ...tenant, id, createdAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'tenants', id), newTenant);
      return newTenant;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tenants');
    }
  };

  const updateTenant = async (id: string, updates: Partial<Tenant>) => {
    try {
      await updateDoc(doc(db, 'tenants', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'tenants');
    }
  };

  const deleteTenant = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tenants', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'tenants');
    }
  };

  return { tenants, addTenant, updateTenant, deleteTenant };
}

export function useClients() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (!tenantId) return;
    const q = query(collection(db, 'clients'), where('tenantId', '==', tenantId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
      setClients(data);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'clients'));
    return () => unsubscribe();
  }, [tenantId]);

  const addClient = async (client: Omit<Client, 'id' | 'createdAt' | 'tenantId'>) => {
    if (!tenantId) return null;
    const id = crypto.randomUUID();
    const newClient = { ...client, id, tenantId, createdAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'clients', id), newClient);
      return newClient;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'clients');
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      await updateDoc(doc(db, 'clients', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'clients');
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'clients', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'clients');
    }
  };

  const getClient = (id: string) => clients.find((c) => c.id === id);

  return { clients, addClient, updateClient, deleteClient, getClient };
}

export function usePayments() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (!tenantId) return;
    const q = query(collection(db, 'payments'), where('tenantId', '==', tenantId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
      setPayments(data);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'payments'));
    return () => unsubscribe();
  }, [tenantId]);

  const addPayment = async (payment: Omit<Payment, 'id' | 'createdAt' | 'tenantId'>) => {
    if (!tenantId) return null;
    const id = crypto.randomUUID();
    const newPayment = { ...payment, id, tenantId, createdAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'payments', id), newPayment);
      return newPayment;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'payments');
    }
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    try {
      await updateDoc(doc(db, 'payments', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'payments');
    }
  };

  const deletePayment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'payments', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'payments');
    }
  };

  return { payments, addPayment, updatePayment, deletePayment };
}

export function useProcesses() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [processes, setProcesses] = useState<Process[]>([]);

  useEffect(() => {
    if (!tenantId) return;
    const q = query(collection(db, 'processes'), where('tenantId', '==', tenantId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Process));
      setProcesses(data);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'processes'));
    return () => unsubscribe();
  }, [tenantId]);

  const addProcess = async (process: Omit<Process, 'id' | 'createdAt' | 'tenantId'>) => {
    if (!tenantId) return null;
    const id = crypto.randomUUID();
    const newProcess = { ...process, id, tenantId, createdAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'processes', id), newProcess);
      return newProcess;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'processes');
    }
  };

  const updateProcess = async (id: string, updates: Partial<Process>) => {
    try {
      await updateDoc(doc(db, 'processes', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'processes');
    }
  };

  const deleteProcess = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'processes', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'processes');
    }
  };

  return { processes, addProcess, updateProcess, deleteProcess };
}

export function useEvents() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (!tenantId) return;
    const q = query(collection(db, 'events'), where('tenantId', '==', tenantId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      setEvents(data);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'events'));
    return () => unsubscribe();
  }, [tenantId]);

  const addEvent = async (event: Omit<Event, 'id' | 'createdAt' | 'tenantId'>) => {
    if (!tenantId) return null;
    const id = crypto.randomUUID();
    const newEvent = { ...event, id, tenantId, createdAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'events', id), newEvent);
      return newEvent;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'events');
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      await updateDoc(doc(db, 'events', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'events');
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'events');
    }
  };

  return { events, addEvent, updateEvent, deleteEvent };
}

export function useUsers() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const q = collection(db, 'users');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setAllUsers(data);
      if (tenantId) {
        setUsers(data.filter(u => u.tenantId === tenantId || u.role === 'superadmin'));
      } else {
        setUsers(data);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'users'));
    return () => unsubscribe();
  }, [tenantId]);

  const addUser = async (user: Omit<User, 'id' | 'tenantId'>) => {
    if (!tenantId) return;
    const id = crypto.randomUUID();
    const newUser = { ...user, id, tenantId };
    try {
      await setDoc(doc(db, 'users', id), newUser);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'users');
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      await updateDoc(doc(db, 'users', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'users');
    }
  };

  return { users, allUsers, addUser, updateUser, deleteUser };
}

export function useCustomVars() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [customVars, setCustomVars] = useState<CustomVar[]>([]);

  useEffect(() => {
    if (!tenantId) return;
    const q = query(collection(db, 'customVars'), where('tenantId', '==', tenantId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomVar));
      setCustomVars(data);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'customVars'));
    return () => unsubscribe();
  }, [tenantId]);

  const addCustomVar = async (key: string, value: string) => {
    if (!tenantId) return;
    const formattedKey = key.toUpperCase().replace(/[^A-Z0-9_]/g, '');
    const id = crypto.randomUUID();
    try {
      await setDoc(doc(db, 'customVars', id), { id, tenantId, key: formattedKey, value });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'customVars');
    }
  };

  const updateCustomVar = async (id: string, key: string, value: string) => {
    const formattedKey = key.toUpperCase().replace(/[^A-Z0-9_]/g, '');
    try {
      await updateDoc(doc(db, 'customVars', id), { key: formattedKey, value });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'customVars');
    }
  };

  const deleteCustomVar = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'customVars', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'customVars');
    }
  };

  return { customVars, addCustomVar, updateCustomVar, deleteCustomVar };
}

export function useTemplates() {
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    if (!tenantId) return;
    const q = query(collection(db, 'templates'), where('tenantId', '==', tenantId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Template));
      setTemplates(data);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'templates'));
    return () => unsubscribe();
  }, [tenantId]);

  const updateTemplate = async (id: string, content: string) => {
    try {
      await updateDoc(doc(db, 'templates', id), { content });
    } catch (error) {
      // If it doesn't exist, we might need to create it
      if (tenantId) {
        try {
          await setDoc(doc(db, 'templates', id), { id, tenantId, type: id, title: id, content });
        } catch (e) {
          handleFirestoreError(e, OperationType.CREATE, 'templates');
        }
      }
    }
  };

  return { templates, updateTemplate };
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentTenant } = useCurrentTenant();
  const tenantId = currentTenant?.id;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isSuperAdmin = firebaseUser.email === 'alexpinto2@gmail.com';
        
        try {
          // Try to fetch the user from Firestore
          const userDoc = await getDocFromServer(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            setCurrentUser({ id: userDoc.id, ...userDoc.data() } as User);
          } else {
            // Create the user if it doesn't exist
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email || 'Usuário',
              email: firebaseUser.email || '',
              role: isSuperAdmin ? 'superadmin' : 'admin',
              tenantId: isSuperAdmin ? undefined : tenantId,
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setCurrentUser(newUser);
          }
        } catch (error) {
          console.error("Error fetching user", error);
          // Fallback
          setCurrentUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email || 'Usuário',
            email: firebaseUser.email || '',
            role: isSuperAdmin ? 'superadmin' : 'admin',
            tenantId: isSuperAdmin ? undefined : tenantId,
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [tenantId]);

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return { currentUser, login, logout, loading };
}
