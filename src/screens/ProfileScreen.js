import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, TextInput, ScrollView, Switch } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/firebaseService';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const { currentUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    profilePicture: '',
    yogaPreferences: [],
  });
  const [loading, setLoading] = useState(true);
  
  // Request permissions for camera and media library
  useEffect(() => {
    (async () => {
      try {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
          console.log('Camera status:', cameraStatus, 'Media status:', mediaStatus);
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    })();
  }, []);
  
  // Yoga class types for preferences
  const yogaTypes = [
    'Hatha',
    'Vinyasa',
    'Ashtanga',
    'Bikram',
    'Iyengar',
    'Kundalini',
    'Restorative',
    'Yin',
    'Prenatal',
    'Kids'
  ];

  useEffect(() => {
    fetchUserProfile();
  }, [currentUser]);

  const fetchUserProfile = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const result = await getUserProfile(currentUser.uid);
      if (!result.error) {
        setProfile({
          ...result.profile,
          name: result.profile.name || currentUser.displayName || '',
          email: result.profile.email || currentUser.email || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleImageUpload = () => {
    Alert.alert(
      'Upload Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => pickImage('camera') },
        { text: 'Choose from Gallery', onPress: () => pickImage('gallery') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const pickImage = async (source) => {
    try {
      // Check permissions first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
      
      let result;
      
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      };
      
      if (source === 'camera') {
        // For camera, we need camera permissions
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
          Alert.alert('Permission needed', 'Sorry, we need camera permissions to make this work!');
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }
      
      console.log('Image picker result:', result);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        console.log('Selected image:', selectedImage);
        setProfile({ ...profile, profilePicture: selectedImage.uri });
      } else {
        console.log('User cancelled image picker or no assets');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    try {
      // If we have a local image URI, we should upload it to a storage service
      // For now, we'll just save the URI if it's not a local file
      let profilePictureUrl = profile.profilePicture;
      
      // Check if it's a local file URI (from camera/gallery)
      if (profilePictureUrl && profilePictureUrl.startsWith('file://')) {
        // In a real app, you would upload this to a storage service like Firebase Storage
        // For now, we'll just show a warning and save the local URI
        // In a production app, you would implement actual image upload here
        console.warn('Local image URI detected. In a production app, this would be uploaded to storage.');
      }
      
      const profileData = {
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        profilePicture: profilePictureUrl,
        yogaPreferences: profile.yogaPreferences,
      };
      
      console.log('Saving profile data for user:', currentUser.uid, profileData);
      const result = await updateUserProfile(currentUser.uid, profileData);
      console.log('Profile save result:', result);
      if (result.error) {
        Alert.alert('Error', result.error);
      } else {
        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    }
  };

  const toggleYogaPreference = (yogaType) => {
    setProfile(prevProfile => {
      const preferences = [...prevProfile.yogaPreferences];
      const index = preferences.indexOf(yogaType);
      
      if (index > -1) {
        // Remove if already selected
        preferences.splice(index, 1);
      } else {
        // Add if not selected
        preferences.push(yogaType);
      }
      
      return { ...prevProfile, yogaPreferences: preferences };
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: profile.profilePicture || 'https://via.placeholder.com/150' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.name}>{profile.name || 'User'}</Text>
        <Text style={styles.email}>{profile.email || 'user@example.com'}</Text>
      </View>
      
      <View style={styles.content}>
        {isEditing ? (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                placeholder="Enter your name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={profile.email}
                editable={false}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile.bio}
                onChangeText={(text) => setProfile({ ...profile, bio: text })}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Profile Picture</Text>
              <TouchableOpacity style={styles.imageUploadContainer} onPress={handleImageUpload}>
                {profile.profilePicture ? (
                  <Image 
                    source={{ uri: profile.profilePicture }} 
                    style={styles.profileImagePreview} 
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.imageOptions}>
                <TouchableOpacity style={styles.imageOptionButton} onPress={() => pickImage('camera')}>
                  <Text style={styles.imageOptionText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageOptionButton} onPress={() => pickImage('gallery')}>
                  <Text style={styles.imageOptionText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Yoga Preferences</Text>
              {yogaTypes.map((type) => (
                <View key={type} style={styles.preferenceItem}>
                  <Text style={styles.preferenceText}>{type}</Text>
                  <Switch
                    value={profile.yogaPreferences.includes(type)}
                    onValueChange={() => toggleYogaPreference(type)}
                  />
                </View>
              ))}
            </View>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.infoText}>{profile.bio || 'No bio added yet.'}</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Yoga Preferences</Text>
              {profile.yogaPreferences && profile.yogaPreferences.length > 0 ? (
                <View style={styles.preferencesContainer}>
                  {profile.yogaPreferences.map((pref, index) => (
                    <View key={index} style={styles.preferenceBadge}>
                      <Text style={styles.preferenceBadgeText}>{pref}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.infoText}>No preferences selected yet.</Text>
              )}
            </View>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: '#e0e0e0',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  infoSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preferenceBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  preferenceBadgeText: {
    color: '#fff',
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  preferenceText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImagePreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePlaceholderText: {
    color: '#666',
    fontSize: 16,
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageOptionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flex: 0.48,
    alignItems: 'center',
  },
  imageOptionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
