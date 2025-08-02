import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Utils
import { formatDate } from '../utils/helpers';

/**
 * Instance item component for displaying class instances
 */
const InstanceItem = ({ instance, onSelect, selected }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, selected && styles.selectedContainer]}
      onPress={() => onSelect(instance)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.dateContainer}>
          <Ionicons 
            name="calendar" 
            size={20} 
            color={selected ? '#4CAF50' : '#666'} 
          />
          <Text style={[styles.date, selected && styles.selectedText]}>
            {formatDate(instance.date)}
          </Text>
        </View>
        
        {instance.comments && (
          <Text style={styles.comments} numberOfLines={2}>
            {instance.comments}
          </Text>
        )}
      </View>
      
      {selected && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedContainer: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  content: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  selectedText: {
    color: '#4CAF50',
  },
  comments: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    marginLeft: 8,
  },
});

export default InstanceItem;