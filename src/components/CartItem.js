import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Utils
import { formatPrice, formatTime, getDayName } from '../utils/helpers';

/**
 * Cart item component for displaying items in the shopping cart
 */
const CartItem = ({ item, onRemove }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.course.classtype}</Text>
          <TouchableOpacity 
            onPress={() => onRemove(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {getDayName(item.course.dayOfWeek)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {formatTime(item.course.time)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="hourglass-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {item.course.durationMinutes} min
            </Text>
          </View>
        </View>
        
        {item.instance && (
          <View style={styles.instanceInfo}>
            <Text style={styles.instanceText}>
              <Text style={styles.instanceLabel}>Date: </Text>
              {item.instance.date}
            </Text>
            {item.instance.comments && (
              <Text style={styles.instanceText} numberOfLines={2}>
                <Text style={styles.instanceLabel}>Notes: </Text>
                {item.instance.comments}
              </Text>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{formatPrice(item.course.price)}</Text>
      </View>
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
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  instanceInfo: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  instanceText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  instanceLabel: {
    fontWeight: 'bold',
  },
  priceContainer: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default CartItem;