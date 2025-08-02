import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getCourses, searchCoursesByType, searchCoursesByDay, searchCoursesByTime, searchCoursesByTeacher, getClassTypes } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const HomeScreen = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDay, setFilterDay] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [availableClassTypes, setAvailableClassTypes] = useState(['all']);
  
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  // Fetch courses when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, [])
  );

  // Fetch all courses and class types
const fetchCourses = async () => {
  setLoading(true);
  try {
    const [coursesResult, classTypesResult] = await Promise.all([
      getCourses(),
      getClassTypes()
    ]);
    
    // Set courses directly - no need for mapping
    setCourses(coursesResult.courses);
    setFilteredCourses(coursesResult.courses);
    
    // Update class types
    if (!classTypesResult.error) {
      setAvailableClassTypes(['all', ...classTypesResult.classTypes]);
    }
  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  // Apply filters and search
useEffect(() => {
  let result = [...courses];

  // Apply search query - use classType
  if (searchQuery) {
    result = result.filter(course => 
      (course.classtype || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.teacher || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply class type filter - use classType
  if (filterType !== 'all') {
    result = result.filter(course => 
      course.classtype && 
      course.classtype.toLowerCase() === filterType.toLowerCase()
    );
}

    // Apply day filter
    if (filterDay !== 'all') {
      result = result.filter(course => course.dayOfWeek === filterDay);
    }

    // Apply time filter
    if (filterTime !== 'all') {
      result = result.filter(course => {
        const courseHour = parseInt(course.time.split(':')[0]);
        if (filterTime === 'morning') return courseHour >= 6 && courseHour < 12;
        if (filterTime === 'afternoon') return courseHour >= 12 && courseHour < 17;
        if (filterTime === 'evening') return courseHour >= 17 && courseHour < 21;
        return true;
      });
    }

    setFilteredCourses(result);
  }, [courses, searchQuery, filterType, filterDay, filterTime]);

  // View course details
  const viewCourseDetails = (course) => {
    navigation.navigate('CourseDetails', { course });
  };

  // Render class type filter buttons
const renderClassTypeFilters = () => {
  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterLabel}>Class Type:</Text>
      <FlatList
        horizontal
        data={availableClassTypes}
        keyExtractor={(item) => `type-${item}`}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterButton, filterType === item && styles.activeFilterButton]}
            onPress={() => setFilterType(item)}
          >
            <Text style={[styles.filterButtonText, filterType === item && styles.activeFilterText]}>
              {item === 'all' ? 'All Types' : item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

  // Render day filter buttons
  const renderDayFilters = () => {
    const days = ['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return (
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Day:</Text>
        <FlatList
          horizontal
          data={days}
          keyExtractor={(item) => `day-${item}`}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterButton, filterDay === item && styles.activeFilterButton]}
              onPress={() => setFilterDay(item)}
            >
              <Text style={[styles.filterButtonText, filterDay === item && styles.activeFilterText]}>
                {item === 'all' ? 'All Days' : item.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  // Render time filter buttons
  const renderTimeFilters = () => {
    const times = [
      { id: 'all', label: 'All Times' },
      { id: 'morning', label: 'Morning' },
      { id: 'afternoon', label: 'Afternoon' },
      { id: 'evening', label: 'Evening' }
    ];
    return (
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Time:</Text>
        <FlatList
          horizontal
          data={times}
          keyExtractor={(item) => `time-${item.id}`}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterButton, filterTime === item.id && styles.activeFilterButton]}
              onPress={() => setFilterTime(item.id)}
            >
              <Text style={[styles.filterButtonText, filterTime === item.id && styles.activeFilterText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  // Render a course item
  const renderCourseItem = ({ item }) => (
  <TouchableOpacity 
    style={styles.courseCard}
    onPress={() => viewCourseDetails(item)}
  >
    <View style={styles.courseHeader}>
      {/* Use classtype to match database field */}
      <Text style={styles.courseType}>{item.classtype}</Text>
      <Text style={styles.coursePrice}>${item.price}</Text>
    </View>
    <Text style={styles.courseDay}>{item.dayOfWeek} at {item.time}</Text>
    <Text style={styles.courseDuration}>{item.durationMinutes} minutes</Text>
    <Text style={styles.courseDescription} numberOfLines={2}>{item.description}</Text>
    <View style={styles.courseFooter}>
      <TouchableOpacity 
        style={styles.detailsButton}
        onPress={() => viewCourseDetails(item)}
      >
        <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search classes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {renderClassTypeFilters()}
      {renderDayFilters()}
      {renderTimeFilters()}

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          renderItem={renderCourseItem}
          contentContainerStyle={styles.coursesList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No classes found. Try adjusting your filters.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  filterContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coursesList: {
    padding: 15,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  coursePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  courseDay: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  courseDuration: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  detailsButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;