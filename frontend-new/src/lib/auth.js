// Auth utility functions
export const setAuthToken = (token) => {
  if (!token) {
    console.error('Attempted to set empty token');
    return;
  }
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

export const getAuthToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const removeAuthToken = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing auth data:', error);
  }
};

export const setUser = (user) => {
  if (!user) {
    console.error('Attempted to set empty user data');
    return;
  }
  try {
    const userData = JSON.stringify(user);
    localStorage.setItem('user', userData);
  } catch (error) {
    console.error('Error setting user data:', error);
  }
};

export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    
    // If no user data exists, return null
    if (!user) {
      console.log('No user data found in localStorage');
      return null;
    }
    
    // If user is 'undefined' string, clear it and return null
    if (user === 'undefined') {
      console.warn('Found "undefined" user data, clearing...');
      localStorage.removeItem('user');
      return null;
    }
    
    // Try to parse the user data
    const parsedUser = JSON.parse(user);
    
    // If parsed user is not an object, clear it and return null
    if (!parsedUser || typeof parsedUser !== 'object') {
      console.warn('Invalid user data format, clearing...', { user, parsedUser });
      localStorage.removeItem('user');
      return null;
    }
    
    return parsedUser;
  } catch (error) {
    console.error('Error getting/parsing user data:', error);
    // Clear potentially corrupted data
    localStorage.removeItem('user');
    return null;
  }
};

export const isAuthenticated = () => {
  try {
    const token = getAuthToken();
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
