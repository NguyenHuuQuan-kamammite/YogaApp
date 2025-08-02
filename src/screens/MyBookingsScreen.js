import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserBookings, cancelBooking, getCourseById } from '../services/firebaseService';
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
        // Fetch course details for each booking
        const bookingsWithCourses = await Promise.all(
          result.bookings.map(async (booking) => {
            const courseResult = await getCourseById(booking.courseId);
            return {
              ...booking,
              course: courseResult.course || null
            };
          })
        );
        setBookings(bookingsWithCourses);
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
                // Update the local state to reflect the cancellation
                setBookings(bookings.map(booking => 
                  booking.id === bookingId 
                    ? { ...booking, status: 'cancelled' } 
                    : booking
                ));
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
          {item.course ? `${item.course.classtype} Yoga` : 'Unknown Class'}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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