import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext();

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_TOKEN: 'SET_TOKEN',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case AUTH_ACTIONS.SET_USER:
      return { ...state, user: action.payload, loading: false, error: null };
    case AUTH_ACTIONS.SET_TOKEN:
      return { ...state, token: action.payload };
    case AUTH_ACTIONS.LOGOUT:
      return { ...state, user: null, token: null, loading: false, error: null };
    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios defaults
  useEffect(() => {
    console.log('Setting axios headers, token:', !!state.token);
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      console.log('Authorization header set');
    } else {
      delete axios.defaults.headers.common['Authorization'];
      console.log('Authorization header removed');
    }
  }, [state.token]);

  // Load user on mount - only if we have a valid token
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const response = await api.get('/api/auth/me');
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });
        } catch (error) {
          console.error('Error loading user:', error);
          // Clear everything on auth error
          localStorage.clear();
          sessionStorage.clear();
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadUser();
  }, [state.token]);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      dispatch({ type: AUTH_ACTIONS.SET_TOKEN, payload: token });
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await axios.post('/api/auth/signup', {
        name,
        email,
        password
      });

      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      toast.success(response.data.message);
      return { success: true, userId: response.data.userId };
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Verify OTP function
  const verifyOTP = async (email, otp) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await axios.post('/api/auth/verify-otp', {
        email,
        otp
      });

      const { token, user } = response.data;
      
      console.log('OTP verification successful, token received:', !!token);
      console.log('User data received:', user);
      
      localStorage.setItem('token', token);
      dispatch({ type: AUTH_ACTIONS.SET_TOKEN, payload: token });
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
      
      // Force axios headers update
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success('Email verified successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'OTP verification failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Resend OTP function
  const resendOTP = async (email) => {
    try {
      const response = await axios.post('/api/auth/resend-otp', { email });
      toast.success(response.data.message);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to resend OTP';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset state
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    
    toast.success('Logged out successfully');
    
    // Redirect to home page instead of reloading
    window.location.href = '/';
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Clear session completely (for development/testing)
  const clearSession = () => {
    localStorage.clear();
    sessionStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    console.log('Session cleared completely');
  };

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    signup,
    verifyOTP,
    resendOTP,
    logout,
    clearSession,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};














// import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const AuthContext = createContext();

// // Action types
// const AUTH_ACTIONS = {
//   SET_LOADING: 'SET_LOADING',
//   SET_USER: 'SET_USER',
//   SET_TOKEN: 'SET_TOKEN',
//   LOGOUT: 'LOGOUT',
//   CLEAR_ERROR: 'CLEAR_ERROR',
//   SET_ERROR: 'SET_ERROR'
// };

// // Initial state
// const initialState = {
//   user: null,
//   token: localStorage.getItem('token'),
//   loading: true,
//   error: null
// };

// // ✅ Base API URL (auto picks prod or local)
// const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// // Reducer
// const authReducer = (state, action) => {
//   switch (action.type) {
//     case AUTH_ACTIONS.SET_LOADING:
//       return { ...state, loading: action.payload };
//     case AUTH_ACTIONS.SET_USER:
//       return { ...state, user: action.payload, loading: false, error: null };
//     case AUTH_ACTIONS.SET_TOKEN:
//       return { ...state, token: action.payload };
//     case AUTH_ACTIONS.LOGOUT:
//       return { ...state, user: null, token: null, loading: false, error: null };
//     case AUTH_ACTIONS.SET_ERROR:
//       return { ...state, error: action.payload, loading: false };
//     case AUTH_ACTIONS.CLEAR_ERROR:
//       return { ...state, error: null };
//     default:
//       return state;
//   }
// };

// // Auth Provider Component
// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   // Set up axios defaults
//   useEffect(() => {
//     if (state.token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
//     } else {
//       delete axios.defaults.headers.common['Authorization'];
//     }
//   }, [state.token]);

//   // Load user on mount
//   useEffect(() => {
//     const loadUser = async () => {
//       if (state.token) {
//         try {
//           const response = await axios.get(`${API}/api/auth/me`);
//           dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });
//         } catch (error) {
//           console.error('Error loading user:', error);
//           localStorage.clear();
//           sessionStorage.clear();
//           delete axios.defaults.headers.common['Authorization'];
//           dispatch({ type: AUTH_ACTIONS.LOGOUT });
//         }
//       } else {
//         dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
//       }
//     };

//     loadUser();
//   }, [state.token]);

//   // Login function
//   const login = async (email, password) => {
//     try {
//       dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

//       const response = await axios.post(`${API}/api/auth/login`, {
//         email,
//         password
//       });

//       const { token, user } = response.data;

//       localStorage.setItem('token', token);
//       dispatch({ type: AUTH_ACTIONS.SET_TOKEN, payload: token });
//       dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });

//       toast.success('Login successful!');
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Login failed';
//       dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   // Signup function
//   const signup = async (name, email, password) => {
//     try {
//       dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

//       const response = await axios.post(`${API}/api/auth/signup`, {
//         name,
//         email,
//         password
//       });

//       dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
//       toast.success(response.data.message);
//       return { success: true, userId: response.data.userId };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Signup failed';
//       dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   // Verify OTP function
//   const verifyOTP = async (email, otp) => {
//     try {
//       dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

//       const response = await axios.post(`${API}/api/auth/verify-otp`, {
//         email,
//         otp
//       });

//       const { token, user } = response.data;

//       localStorage.setItem('token', token);
//       dispatch({ type: AUTH_ACTIONS.SET_TOKEN, payload: token });
//       dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });

//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//       toast.success('Email verified successfully!');
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.error || 'OTP verification failed';
//       dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   // Resend OTP function
//   const resendOTP = async (email) => {
//     try {
//       const response = await axios.post(`${API}/api/auth/resend-otp`, { email });
//       toast.success(response.data.message);
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Failed to resend OTP';
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   // Logout function
//   const logout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     delete axios.defaults.headers.common['Authorization'];
//     dispatch({ type: AUTH_ACTIONS.LOGOUT });
//     toast.success('Logged out successfully');
//     window.location.href = '/';
//   };

//   // Clear error function
//   const clearError = () => {
//     dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
//   };

//   // Clear session completely (for development/testing)
//   const clearSession = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     delete axios.defaults.headers.common['Authorization'];
//     dispatch({ type: AUTH_ACTIONS.LOGOUT });
//     console.log('Session cleared completely');
//   };

//   const value = {
//     user: state.user,
//     token: state.token,
//     loading: state.loading,
//     error: state.error,
//     login,
//     signup,
//     verifyOTP,
//     resendOTP,
//     logout,
//     clearSession,
//     clearError
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
