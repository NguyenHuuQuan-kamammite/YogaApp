import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getCourseInstances, getTeacherById } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const CourseDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { course } = route.params;
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [instances, setInstances] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedInstance, setSelectedInstance] = useState(null);

  useEffect(() => {
    fetchCourseInstances();
  }, []);

  const fetchCourseInstances = async () => {
    setLoading(true);
    try {
      const result = await getCourseInstances(course.id);
      if (result.error) {
        Alert.alert('Error', result.error);
      } else {
        // Filter out past dates - only show future or today's classes
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for comparison
        
        const futureInstances = result.instances.filter(instance => {
          const instanceDate = new Date(instance.date);
          return instanceDate >= today;
        });
        
        setInstances(futureInstances);
        
        // Fetch teacher details for each instance
        // Convert teacherId to string since teachers collection uses string IDs
        const teacherIds = [...new Set(futureInstances.map(instance => instance.teacherId))];
        const teacherData = {};
        
        for (const teacherId of teacherIds) {
          // Convert number teacherId to string for proper lookup
          const teacherIdAsString = String(teacherId);
          const teacherResult = await getTeacherById(teacherIdAsString);
          if (!teacherResult.error) {
            // Store using the original numeric ID since that's what's in the instance
            teacherData[teacherId] = teacherResult.teacher;
          }
        }
        
        setTeachers(teacherData);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to add classes to cart',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth') }
        ]
      );
      return;
    }

    if (!selectedInstance) {
      Alert.alert('Selection Required', 'Please select a class date');
      return;
    }

    const success = addToCart(course, selectedInstance);
    if (success) {
      Alert.alert(
        'Added to Cart',
        'Class has been added to cart',
        [
          { text: 'Continue Shopping', style: 'cancel' },
          { text: 'View Cart', onPress: () => navigation.navigate('Main', { screen: 'Cart' }) }
        ]
      );
    } else {
      Alert.alert('Already in Cart', 'This class is already in cart');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{course.classtype} Yoga</Text>
        <Text style={styles.price}>${course.price}</Text>
      </View>

      <View style={styles.classTypeContainer}>
        <Text style={styles.classTypeLabel}>Class Type:</Text>
        <View style={styles.classTypeTag}>
          <Text style={styles.classTypeText}>{course.classtype}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Day:</Text>
          <Text style={styles.infoValue}>{course.dayOfWeek}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Time:</Text>
          <Text style={styles.infoValue}>{course.time}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Duration:</Text>
          <Text style={styles.infoValue}>{course.durationMinutes} minutes</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Capacity:</Text>
          <Text style={styles.infoValue}>{course.capacity} people</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{course.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Dates</Text>

        {instances.length > 0 ? (
          instances.map((instance) => (
            <TouchableOpacity
              key={instance.id}
              style={[styles.instanceCard, selectedInstance?.id === instance.id && styles.selectedInstance]}
              onPress={() => setSelectedInstance(instance)}
            >
              <View style={styles.instanceHeader}>
                <Text style={styles.instanceDate}>{formatDate(instance.date)}</Text>
                {selectedInstance?.id === instance.id && (
                  <Text style={styles.selectedText}>Selected</Text>
                )}
              </View>
              {teachers[instance.teacherId] ? (
                <View style={styles.teacherInfo}>
                  <Text style={styles.teacherName}>Teacher: {teachers[instance.teacherId]?.name || 'Unknown'}</Text>
                </View>
              ) : (
                <View style={styles.teacherInfo}>
                  <Text style={styles.teacherName}>Teacher: Not available</Text>
                </View>
              )}
              {instance.comments && (
                <View style={styles.commentsContainer}>
                  <Text style={styles.commentsLabel}>Notes:</Text>
                  <Text style={styles.instanceComments}>{instance.comments}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noInstances}>No upcoming classes available</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.addButton, (!selectedInstance || !isAuthenticated) && styles.disabledButton]}
        onPress={handleAddToCart}
      >
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  classTypeContainer: {
    padding: 15,
    backgroundColor: '#f0f9f0',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  classTypeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  classTypeTag: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  classTypeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  classTypeContainer: {
    padding: 15,
    backgroundColor: '#f0f9f0',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  classTypeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  classTypeTag: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  classTypeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  instanceCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedInstance: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#f0f9f0',
  },
  instanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  instanceDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  teacherInfo: {
    marginTop: 5,
  },
  teacherName: {
    fontSize: 14,
    color: '#666',
  },
  commentsContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  commentsLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 2,
  },
  instanceComments: {
    fontSize: 14,
    color: '#555',
    lineHeight: 18,
  },
  noInstances: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CourseDetailsScreen;