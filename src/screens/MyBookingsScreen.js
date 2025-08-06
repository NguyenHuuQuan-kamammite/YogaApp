import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserBookings, cancelBooking, getCourseById, getTeacherById, getInstanceById } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = useAuth();

  // Fetch bookings when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [userId])
  );



  const fetchBookings = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const result = await getUserBookings(userId);
      if (result.error) {
        Alert.alert('Error', result.error);
      } else {
        // Fetch course, instance, and teacher details for each booking
        const bookingsWithDetails = await Promise.all(
          result.bookings.map(async (booking) => {
            // Fetch course details
            const courseResult = await getCourseById(booking.courseId);
            
            // Fetch instance details
            let instance = null;
            let teacher = null;
            if (booking.instanceId) {
              const instanceResult = await getInstanceById(booking.instanceId);
              if (!instanceResult.error) {
                instance = instanceResult.instance;
                
                // Fetch teacher details if teacherId exists in instance
                if (instance.teacherId) {
                  // Convert number teacherId to string for proper lookup
                  const teacherIdAsString = String(instance.teacherId);
                  const teacherResult = await getTeacherById(teacherIdAsString);
                  if (!teacherResult.error) {
                    teacher = teacherResult.teacher;
                  }
                }
              }
            }
            
            return {
              ...booking,
              course: courseResult.course || null,
              instance: instance,
              teacher: teacher
            };
          })
        );
        setBookings(bookingsWithDetails);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            try {
              const result = await cancelBooking(bookingId);
              if (result.error) {
                Alert.alert('Error', result.error);
              } else {
                // Immediately remove the cancelled booking from the list
                setBookings(prevBookings => 
                  prevBookings.filter(booking => booking.id !== bookingId)
                );
                
                Alert.alert('Success', 'Your booking has been cancelled');
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return 'Unknown date';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString(undefined, options);
  };

  const renderBookingItem = ({ item }) => (
    <View style={[styles.bookingCard, item.status === 'cancelled' && styles.cancelledBooking]}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingTitle}>
          {item.course ? `${item.course.classType} Yoga` : 'Unknown Class'}
        </Text>
        <View style={[styles.statusBadge, item.status === 'cancelled' && styles.cancelledBadge]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {item.course && (
        <View style={styles.courseDetails}>
          <Text style={styles.courseInfo}>{item.course.dayOfWeek} at {item.course.time}</Text>
          <Text style={styles.courseInfo}>{item.course.durationMinutes} minutes</Text>
        </View>
      )}

      {item.teacher && (
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherLabel}>Teacher:</Text>
          <Text style={styles.teacherName}>{item.teacher.name}</Text>
        </View>
      )}

      {item.instance?.comments && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsLabel}>Class Notes:</Text>
          <Text style={styles.commentsText}>{item.instance.comments}</Text>
        </View>
      )}

      <View style={styles.bookingDetails}>
        <Text style={styles.bookingLabel}>Booking Date:</Text>
        <Text style={styles.bookingValue}>{formatDate(item.bookingDate)}</Text>
      </View>

      {item.status === 'active' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelBooking(item.id)}
        >
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>

      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.bookingsList}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchBookings();
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any bookings yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingsList: {
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  cancelledBooking: {
    borderLeftColor: '#999',
    opacity: 0.8,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cancelledBadge: {
    backgroundColor: '#999',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  courseDetails: {
    marginBottom: 10,
  },
  courseInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  bookingDetails: {
    marginBottom: 10,
  },
  bookingLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  bookingValue: {
    fontSize: 14,
    color: '#666',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  teacherInfo: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  teacherLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  teacherName: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  commentsContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f0f9f0',
    borderRadius: 5,
  },
  commentsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  commentsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default MyBookingsScreen;