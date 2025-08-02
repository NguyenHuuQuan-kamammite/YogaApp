/**
 * Utility functions for the Yoga App
 */

/**
 * Format a date object to a readable string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string (e.g., "Mon, Jan 1, 2023")
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  // Handle Firestore timestamp objects
  const dateObj = date instanceof Date ? date : date.toDate();
  
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format time (e.g., "14:00") to a more readable format (e.g., "2:00 PM")
 * @param {string} time - Time string in 24-hour format (HH:MM)
 * @returns {string} Formatted time string
 */
export const formatTime = (time) => {
  if (!time) return 'N/A';
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  
  return `${formattedHour}:${minutes} ${period}`;
};

/**
 * Format price to currency string
 * @param {number} price - The price to format
 * @returns {string} Formatted price string (e.g., "$10.00")
 */
export const formatPrice = (price) => {
  if (price === undefined || price === null) return 'N/A';
  
  return `$${parseFloat(price).toFixed(2)}`;
};

/**
 * Get day name from day number (0-6)
 * @param {number} dayNumber - Day number (0 = Sunday, 6 = Saturday)
 * @returns {string} Day name
 */
export const getDayName = (dayNumber) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber] || 'Unknown';
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if password is strong enough
 */
export const isStrongPassword = (password) => {
  return password && password.length >= 6;
};