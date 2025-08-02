import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

// Import Firebase configuration
import { auth, db } from '../firebase/config';


// Authentication functions
export const registerUser = async (email, password) => {
  try {
    console.log('Registration attempt with email:', email);
    console.log('Firebase auth instance:', auth ? 'Valid' : 'Invalid');
    console.log('Firebase config:', JSON.stringify(auth.app.options));
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Registration successful, user:', userCredential.user.uid);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Registration error:', error.code, error.message);
    return { user: null, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log('Login attempt with email:', email);
    console.log('Firebase auth instance:', auth ? 'Valid' : 'Invalid');
    console.log('Firebase config:', JSON.stringify(auth.app.options));
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login successful, user:', userCredential.user.uid);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Login error:', error.code, error.message);
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions

// Courses
// Modify getCourses to include class type
export const getCourses = async () => {
  try {
    const coursesCollection = collection(db, 'courses');
    const coursesSnapshot = await getDocs(coursesCollection);
    const coursesList = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Add this to include class type name
      classtype: doc.data().classtype || 'General' // Default value
    }));
    return { courses: coursesList, error: null };
  } catch (error) {
    return { courses: [], error: error.message };
  }
};

export const getCourseById = async (courseId) => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (courseSnap.exists()) {
      return { 
        course: { id: courseSnap.id, ...courseSnap.data() }, 
        error: null 
      };
    } else {
      return { course: null, error: 'Course not found' };
    }
  } catch (error) {
    return { course: null, error: error.message };
  }
};

// Course Instances
export const getCourseInstances = async (courseId) => {
  try {
    const instancesCollection = collection(db, 'instances');
    const q = query(instancesCollection, where("courseId", "==", courseId));
    const instancesSnapshot = await getDocs(q);
    const instancesList = instancesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { instances: instancesList, error: null };
  } catch (error) {
    return { instances: [], error: error.message };
  }
};

// Teachers
export const getTeacherById = async (teacherId) => {
  try {
    const teacherRef = doc(db, 'teachers', teacherId);
    const teacherSnap = await getDoc(teacherRef);
    
    if (teacherSnap.exists()) {
      return { 
        teacher: { id: teacherSnap.id, ...teacherSnap.data() }, 
        error: null 
      };
    } else {
      return { teacher: null, error: 'Teacher not found' };
    }
  } catch (error) {
    return { teacher: null, error: error.message };
  }
};

// Bookings
export const createBooking = async (bookingData) => {
  try {
    const bookingsCollection = collection(db, 'bookings');
    const docRef = await addDoc(bookingsCollection, {
      ...bookingData,
      bookingDate: new Date(),
      status: 'active'
    });
    return { bookingId: docRef.id, error: null };
  } catch (error) {
    return { bookingId: null, error: error.message };
  }
};

export const getUserBookings = async (userId) => {
  try {
    const bookingsCollection = collection(db, 'bookings');
    const q = query(
      bookingsCollection, 
      where("customerId", "==", userId),
      orderBy("bookingDate", "desc")
    );
    const bookingsSnapshot = await getDocs(q);
    const bookingsList = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      bookingDate: doc.data().bookingDate.toDate() // Convert Firestore timestamp to JS Date
    }));
    return { bookings: bookingsList, error: null };
  } catch (error) {
    return { bookings: [], error: error.message };
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: 'cancelled'
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Search and filtering
export const searchCoursesByType = async (classType) => {
  try {
    const coursesCollection = collection(db, 'courses');
    const q = query(coursesCollection, where("classtype", "==", classType));
    const coursesSnapshot = await getDocs(q);
    const coursesList = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { courses: coursesList, error: null };
  } catch (error) {
    return { courses: [], error: error.message };
  }
};

// Get all available class types
export const getClassTypes = async () => {
  try {
    const coursesCollection = collection(db, 'courses');
    const coursesSnapshot = await getDocs(coursesCollection);
    
    // Extract unique class types
    const classTypes = new Set();
    coursesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.classtype) {
        classTypes.add(data.classtype);
      }
    });
    
    return { classTypes: Array.from(classTypes).sort(), error: null };
  } catch (error) {
    return { classTypes: [], error: error.message };
  }
};

export const searchCoursesByDay = async (dayOfWeek) => {
  try {
    const coursesCollection = collection(db, 'courses');
    const q = query(coursesCollection, where("dayOfWeek", "==", dayOfWeek));
    const coursesSnapshot = await getDocs(q);
    const coursesList = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { courses: coursesList, error: null };
  } catch (error) {
    return { courses: [], error: error.message };
  }
};

export const searchCoursesByTime = async (time) => {
  try {
    const coursesCollection = collection(db, 'courses');
    const q = query(coursesCollection, where("time", "==", time));
    const coursesSnapshot = await getDocs(q);
    const coursesList = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { courses: coursesList, error: null };
  } catch (error) {
    return { courses: [], error: error.message };
  }
};

export const searchCoursesByTeacher = async (teacherId) => {
  try {
    const instancesCollection = collection(db, 'instances');
    const q = query(instancesCollection, where("teacherId", "==", teacherId));
    const instancesSnapshot = await getDocs(q);
    const instancesList = instancesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get unique course IDs
    const courseIds = [...new Set(instancesList.map(instance => instance.courseId))];
    
    // Fetch course details for each course ID
    const coursePromises = courseIds.map(id => getCourseById(id));
    const courseResults = await Promise.all(coursePromises);
    
    // Filter out any errors
    const courses = courseResults
      .filter(result => !result.error)
      .map(result => result.course);
    
    return { courses, error: null };
  } catch (error) {
    return { courses: [], error: error.message };
  }
};