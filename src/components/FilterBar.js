import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

/**
 * Filter bar component for filtering yoga classes by day and time
 */
const FilterBar = ({ 
  selectedDay, 
  setSelectedDay,
  selectedTime,
  setSelectedTime,
  selectedType,
  setSelectedType
}) => {
  // Days of the week
  const days = [
    { id: null, label: 'All Days' },
    { id: 0, label: 'Sunday' },
    { id: 1, label: 'Monday' },
    { id: 2, label: 'Tuesday' },
    { id: 3, label: 'Wednesday' },
    { id: 4, label: 'Thursday' },
    { id: 5, label: 'Friday' },
    { id: 6, label: 'Saturday' },
  ];

  // Time slots
  const times = [
    { id: null, label: 'Any Time' },
    { id: 'morning', label: 'Morning' },
    { id: 'afternoon', label: 'Afternoon' },
    { id: 'evening', label: 'Evening' },
  ];

  // Class types
  const types = [
    { id: null, label: 'All Types' },
    { id: 'Hatha', label: 'Hatha' },
    { id: 'Vinyasa', label: 'Vinyasa' },
    { id: 'Yin', label: 'Yin' },
    { id: 'Ashtanga', label: 'Ashtanga' },
    { id: 'Restorative', label: 'Restorative' },
  ];

  return (
    <View style={styles.container}>
      {/* Day filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Day</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {days.map((day) => (
            <TouchableOpacity
              key={day.label}
              style={[
                styles.filterChip,
                selectedDay === day.id && styles.selectedChip
              ]}
              onPress={() => setSelectedDay(day.id)}
            >
              <Text 
                style={[
                  styles.filterChipText,
                  selectedDay === day.id && styles.selectedChipText
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Time filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Time</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {times.map((time) => (
            <TouchableOpacity
              key={time.label}
              style={[
                styles.filterChip,
                selectedTime === time.id && styles.selectedChip
              ]}
              onPress={() => setSelectedTime(time.id)}
            >
              <Text 
                style={[
                  styles.filterChipText,
                  selectedTime === time.id && styles.selectedChipText
                ]}
              >
                {time.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Class type filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Class Type</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {types.map((type) => (
            <TouchableOpacity
              key={type.label}
              style={[
                styles.filterChip,
                selectedType === type.id && styles.selectedChip
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <Text 
                style={[
                  styles.filterChipText,
                  selectedType === type.id && styles.selectedChipText
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
  },
  filterScrollContent: {
    paddingHorizontal: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selectedChip: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  selectedChipText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default FilterBar;