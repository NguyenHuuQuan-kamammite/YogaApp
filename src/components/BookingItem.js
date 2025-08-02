import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Utils
import { formatDate, formatTime, getDayName } from '../utils/helpers';

/**
 * Booking item component for displaying user bookings
 */
const BookingItem = ({ booking, course, instance, onCancel }) => {
  const isActive = booking.status === 'active';
  
  return (
    <View style={[styles.container, !isActive && styles.cancelledContainer]}>
      {!isActive && (
        <View style={styles.cancelledBadge}>
          <Text style={styles.cancelledText}>Cancelled</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <Text style={styles.title}>{course?.classtype || 'Unknown Class'}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, isActive ? styles.activeDot : styles.cancelledDot]} />
          <Text style={[styles.statusText, isActive ? styles.activeText : styles.cancelledText]}>
            {isActive ? 'Active' : 'Cancelled'}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        {instance?.date && (
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.detailText}>
              {formatDate(instance.date)}
            </Text>
          </View>
        )}
        
        {course?.time && (
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {formatTime(course.time)}
            </Text>
          </View>
        )}
        
        {course?.dayOfWeek !== undefined && (
          <View style={styles.detailRow}>
            <Ionicons name="today-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {getDayName(course.dayOfWeek)}
            </Text>
          </View>
        )}
      </View>
      
      {booking.bookingDate && (
        <Text style={styles.bookingDate}>
          Booked on: {formatDate(booking.bookingDate)}
        </Text>
      )}
      
      {isActive && (
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => onCancel(booking.id)}
        >
          <Ionicons name="close-circle-outline" size={16} color="#F44336" />
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  cancelledContainer: {
    borderLeftColor: '#F44336',
    opacity: 0.8,
  },
  cancelledBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 8,
  },
  cancelledText: {
    color: '#F44336',
    fontWeight: '600',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
  cancelledDot: {
    backgroundColor: '#F44336',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#4CAF50',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  bookingDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
  },
  cancelButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#F44336',
    fontWeight: '600',
  },
});

export default BookingItem;