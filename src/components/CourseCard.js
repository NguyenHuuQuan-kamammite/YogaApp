import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Utils
import { formatPrice, formatTime, getDayName } from '../utils/helpers';

/**
 * Course card component for displaying yoga class information
 */
const CourseCard = ({ course, onPress, onAddToCart }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(course)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{course.classtype}</Text>
          <Text style={styles.price}>{formatPrice(course.price)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{getDayName(course.dayOfWeek)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{formatTime(course.time)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="hourglass-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{course.durationMinutes} min</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {course.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.capacityContainer}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.capacityText}>Capacity: {course.capacity}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => onAddToCart(course)}
          >
            <Ionicons name="cart-outline" size={20} color="#4CAF50" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacityText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default CourseCard;