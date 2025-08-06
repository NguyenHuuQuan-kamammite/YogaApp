import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const getInstanceById = async (instanceId) => {
  try {
    const instanceRef = doc(db, 'instances', instanceId);
    const instanceSnap = await getDoc(instanceRef);
    
    if (instanceSnap.exists()) {
      return { 
        instance: { id: instanceSnap.id, ...instanceSnap.data() }, 
        error: null 
      };
    } else {
      return { instance: null, error: 'Instance not found' };
    }
  } catch (error) {
    return { instance: null, error: error.message };
  }
};
