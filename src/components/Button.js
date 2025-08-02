import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

/**
 * Custom button component with loading state
 */
const Button = ({ 
  title, 
  onPress, 
  type = 'primary', // primary, secondary, danger
  disabled = false,
  loading = false,
  style = {},
  textStyle = {}
}) => {
  // Determine button style based on type
  const buttonStyle = [
    styles.button,
    type === 'primary' && styles.primaryButton,
    type === 'secondary' && styles.secondaryButton,
    type === 'danger' && styles.dangerButton,
    disabled && styles.disabledButton,
    style
  ];

  // Determine text style based on type
  const buttonTextStyle = [
    styles.buttonText,
    type === 'primary' && styles.primaryButtonText,
    type === 'secondary' && styles.secondaryButtonText,
    type === 'danger' && styles.dangerButtonText,
    disabled && styles.disabledButtonText,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={type === 'primary' ? '#fff' : '#4CAF50'} 
        />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#4CAF50', // Green color
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  dangerButton: {
    backgroundColor: '#F44336', // Red color
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    borderColor: '#CCCCCC',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#4CAF50',
  },
  dangerButtonText: {
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: '#888888',
  },
});

export default Button;