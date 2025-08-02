import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Teacher info component for displaying teacher details
 */
const TeacherInfo = ({ teacher }) => {
  if (!teacher) return null;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Teacher</Text>
      </View>
      
      <View style={styles.teacherCard}>
        <View style={styles.teacherHeader}>
          {teacher.photoUri ? (
            <Image 
              source={{ uri: teacher.photoUri }} 
              style={styles.teacherImage} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.teacherImagePlaceholder}>
              <Ionicons name="person" size={30} color="#999" />
            </View>
          )}
          
          <View style={styles.teacherInfo}>
            <Text style={styles.teacherName}>{teacher.name}</Text>
            
            <View style={styles.contactInfo}>
              {teacher.email && (
                <View style={styles.contactItem}>
                  <Ionicons name="mail-outline" size={14} color="#666" />
                  <Text style={styles.contactText}>{teacher.email}</Text>
                </View>
              )}
              
              {teacher.phone && (
                <View style={styles.contactItem}>
                  <Ionicons name="call-outline" size={14} color="#666" />
                  <Text style={styles.contactText}>{teacher.phone}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        {teacher.bio && (
          <Text style={styles.teacherBio}>{teacher.bio}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  teacherCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  teacherHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  teacherImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  teacherImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  teacherInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  teacherName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  contactInfo: {
    marginTop: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  teacherBio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default TeacherInfo;